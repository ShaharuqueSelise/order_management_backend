// routes/orders.js
import express from "express";
import {
  Order,
  OrderItem,
  Promotion,
  PromotionSlab,
  Product,
} from "../models/index.js";
import { Op } from "sequelize";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Calculate discounts helper
// async function calculateItemDiscount(productId, quantity) {
//   const product = await Product.findByPk(productId);
//   if (!product?.isEnabled) return 0;

//   const promotions = await Promotion.findAll({
//     where: {
//       [Op.or]: [{ productId }, { productId: null }],
//       isEnabled: true,
//       startDate: { [Op.lte]: new Date() },
//       endDate: { [Op.gte]: new Date() }
//     },
//     include: [{ model: PromotionSlab, as: 'slabs' }]
//   });

//   let maxDiscount = 0;

//   for (const promo of promotions) {
//     let discount = 0;
//     const totalWeight = product.weight * quantity;

//     switch(promo.discountType) {
//       case 'percentage':
//         discount = product.price * quantity * (promo.discountValue / 100);
//         break;
//       case 'fixed':
//         discount = promo.discountValue * quantity;
//         break;
//       case 'weighted':
//         const slab = promo.slabs.find(s =>
//           totalWeight >= s.minWeight &&
//           (s.maxWeight === null || totalWeight < s.maxWeight)
//         );
//         if (slab) discount = slab.discountPerUnit * quantity;
//         break;
//     }

//     if (discount > maxDiscount) maxDiscount = discount;
//   }

//   return maxDiscount;
// }

async function calculateDiscount(productId, quantity) {
  const product = await Product.findByPk(productId);
  if (!product || !product.isEnabled) return 0;

  const promotions = await Promotion.findAll({
    where: {
      [Op.or]: [{ productId }, { productId: null }],
      isEnabled: true,
      startDate: { [Op.lte]: new Date() },
      endDate: { [Op.gte]: new Date() },
    },
    include: [{ model: PromotionSlab, as: 'slabs' }]
  });

  console.log(promotions);

  let maxDiscount = 0;

  for (const promo of promotions) {
    let discount = 0;
    const totalWeight = product.weight * quantity;
    console.log(totalWeight,'totalWeight')

    switch (promo.discountType) {
      case "percentage":
        discount = product.price * quantity * (promo.discountValue / 100);
        break;

      case "fixed":
        discount = promo.discountValue * quantity;
        break;

      case "weighted":
        if (promo.slabs?.length) {
          // Sort slabs by minWeight ascending
          const sortedSlabs = [...promo.slabs].sort(
            (a, b) => a.minWeight - b.minWeight
          );

          // Find applicable slab
          const slab = sortedSlabs.find(
            (s) =>
              totalWeight >= s.minWeight &&
              (s.maxWeight === null || totalWeight < s.maxWeight)
          );

          if (slab) {
            discount = slab.discountPerUnit * quantity;
          }
        }
        // const slab = PromotionSlab.findAll({
        //   where: {
        //     promotionId: promo.id,
        //     minWeight: {
        //       [Op.lte]: totalWeight,
        //     },
        //     maxWeight: {
        //       [Op.gte]: totalWeight,
        //     },
        //   },
        // });
        // console.log(slab, 'slab')
        // if (slab) {
        //   discount = slab.discountPerUnit * quantity;
        // }
        
        break;
    }

    // Only consider discount if it's better than current max
    if (discount > maxDiscount) {
      maxDiscount = discount;
    }
  }

  // Ensure discount doesn't exceed item total price
  const itemTotal = product.price * quantity;
  return Math.min(maxDiscount, itemTotal);
}

// Create Order
router.post("/create/order", authMiddleware, async (req, res) => {
  try {
    const { customerInfo, items } = req.body;

    // Validate input
    if (!customerInfo?.name || !items?.length) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Calculate order totals
    let subtotal = 0;
    let totalDiscount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product?.isEnabled) {
        return res
          .status(400)
          .json({ error: `Product ${item.productId} is unavailable` });
      }

      const discount = await calculateDiscount(item.productId, item.quantity);
      const itemTotal = product.price * item.quantity;
      const itemDiscount = Math.min(discount, itemTotal); // Prevent negative prices

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        discount: itemDiscount,
        totalPrice: itemTotal - itemDiscount,
      });

      subtotal += itemTotal;
      totalDiscount += itemDiscount;
    }

    // Create order
    const order = await Order.create({
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerAddress: customerInfo.address,
      subtotal,
      totalDiscount,
      grandTotal: subtotal - totalDiscount,
      status: "pending",
    });

    // Create order items
    await OrderItem.bulkCreate(
      orderItems.map((item) => ({
        ...item,
        orderId: order.id,
        customerId: req.user.id,
      }))
    );

    // Fetch complete order details
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product", // Make sure this matches the alias in `OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" })`
            },
          ],
        },
      ],
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [Product],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
