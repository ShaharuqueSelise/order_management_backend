import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { Promotion, PromotionSlab } from "../models/index.js";
import { sequelize } from '../config/db.js';

const router = express.Router();

// Get all promotions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      include: [{
        model: PromotionSlab,
        as: 'slabs',
        attributes: ['id', 'minWeight', 'maxWeight', 'discountPerUnit']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new promotion
router.post('/create/promotion', authMiddleware, async (req, res) => {
 
  try {
    const { title, discountType, discountValue, startDate, endDate, productId, slabs } = req.body;

    // Validate required fields
    if (!title || !discountType || !startDate || !endDate) {
     
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate discount value based on type
    if (discountType !== 'weighted' && !discountValue) {
      
      return res.status(400).json({ error: 'Discount value is required for this type' });
    }

    // Create promotion
    const promotion = await Promotion.create({
      title,
      discountType,
      discountValue,
      startDate,
      endDate,
      productId
    });

    // Create slabs for weighted promotions
    if (discountType === 'weighted') {
      if (!slabs || !slabs.length) {
        
        return res.status(400).json({ error: 'Slabs are required for weighted promotions' });
      }

      const formattedSlabs = slabs.map(slab => ({
        ...slab,
        promotionId: promotion.id
      }));

      await PromotionSlab.bulkCreate(formattedSlabs);
    }

    
    // Fetch created promotion with slabs
    const result = await Promotion.findByPk(promotion.id, {
      include: [{ model: PromotionSlab, as: 'slabs' }]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Update promotion
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, isEnabled } = req.body;

    // Only allow updating specific fields
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const updatedPromotion = await promotion.update({
      title: title || promotion.title,
      startDate: startDate || promotion.startDate,
      endDate: endDate || promotion.endDate,
      isEnabled: isEnabled !== undefined ? isEnabled : promotion.isEnabled
    });

    res.json(updatedPromotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete promotion
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByPk(id);
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.destroy();
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;