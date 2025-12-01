const express = require('express');
const { Rating, Item } = require('..');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.post('/:itemId', authMiddleware, async (req,res) => {
  try {
    const { itemId } = req.params;
    const { stars } = req.body;
    if(!stars || stars < 1 || stars > 5) return res.status(400).json({ error: 'Invalid stars' });
    const item = await Item.findByPk(itemId);
    if(!item) return res.status(404).json({ error: 'Item not found' });
    const existing = await Rating.findOne({ where: { user_id: req.user.id, item_id: itemId } });
    if(existing){
      existing.stars = stars;
      await existing.save();
      return res.json(existing);
    }
    const r = await Rating.create({ user_id: req.user.id, item_id: itemId, stars });
    res.status(201).json(r);
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/:itemId/average', async (req,res) => {
  try {
    const { itemId } = req.params;
    const avg = await Rating.findAll({
      attributes: [[Rating.sequelize.fn('AVG', Rating.sequelize.col('stars')), 'avgStars']],
      where: { item_id: itemId },
      raw: true
    });
    const avgStars = avg && avg[0] && avg[0].avgStars ? Number(parseFloat(avg[0].avgStars).toFixed(1)) : 0;
    res.json({ avg: avgStars });
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
