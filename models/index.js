import { sequelize } from "../config/db.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Product from "./product.js";
import Promotion from "./promotion.js";
import PromotionSlab from "./promotionSlab.js";

// Define associations **after** models are imported
Promotion.hasMany(PromotionSlab, {
  foreignKey: "promotionId",
  as: "slabs",
  onDelete: "CASCADE",
});
PromotionSlab.belongsTo(Promotion, {
  foreignKey: "promotionId",
  as: "promotion",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Product.hasMany(OrderItem, {
  as: "orderItems",
  foreignKey: "productId",
});
OrderItem.belongsTo(Product, {
  as: "product",
  foreignKey: "productId",
});

// Sync models
await sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully");
});

export { Promotion, PromotionSlab, Order, OrderItem, Product };
