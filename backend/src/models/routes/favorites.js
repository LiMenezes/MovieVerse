const express = require('express');
const { Favorite, Item } = require('..');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.post('/:itemId', authMiddleware, async (req,res) => {
  try {
    const item = await Item.findByPk(req.params.itemId);
    if(!item) return res.status(404).json({ error: 'Item not found' });
    const [fav, created] = await Favorite.findOrCreate({
      where: { user_id: req.user.id, item_id: item.id },
      defaults: { user_id: req.user.id, item_id: item.id }
    });
    res.json(fav);
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/user/:userId', async (req,res) => {
  try {
    const favs = await Favorite.findAll({ where: { user_id: req.params.userId }, include: [{ model: Item }] });
    res.json(favs);
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:itemId', authMiddleware, async (req,res) => {
  try {
    const deleted = await Favorite.destroy({ where: { user_id: req.user.id, item_id: req.params.itemId }});
    res.json({ deleted: !!deleted });
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
