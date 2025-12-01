const express = require('express');
const { User, Item } = require('..');
const router = express.Router();

router.get('/:id', async (req,res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id','name','username','email','created_at'] });
    if(!user) return res.status(404).json({ error: 'User not found' });
    const items = await Item.findAll({ where: { owner_id: user.id }});
    res.json({ user, items });
  } catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
