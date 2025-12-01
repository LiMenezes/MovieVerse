const express = require('express');
const { Comment, Item } = require('..');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.post('/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { message, email } = req.body;
    if(!message) return res.status(400).json({ error: 'Missing message' });
    const item = await Item.findByPk(itemId);
    if(!item) return res.status(404).json({ error: 'Item not found' });
    const c = await Comment.create({ user_id: req.user.id, item_id: itemId, message, email });
    res.status(201).json(c);
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/:itemId', async (req,res) => {
  try {
    const { itemId } = req.params;
    const list = await Comment.findAll({ where: { item_id: itemId }, order: [['created_at','DESC']] });
    res.json(list);
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
