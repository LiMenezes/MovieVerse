const express = require('express');
const { Item, User, Actor, Platform, Rating, Comment, ItemPlatform } = require('..');
const { authMiddleware } = require('../middlewares/auth');
const { Op } = require('sequelize');
const router = express.Router();

// List with search + filters
router.get('/', async (req, res) => {
  try {
    const { q, type, genre, page = 1, pageSize = 20, sort = 'recent' } = req.query;
    const where = {};
    if(q) where.title = { [Op.like]: `%${q}%` };
    if(type) where.type = type;
    if(genre) where.genre = genre;
    const order = [['created_at','DESC']];
    const items = await Item.findAndCountAll({
      where,
      include: [
        { model: Actor, as: 'actors', through: { attributes: [] } },
        { model: Platform, as: 'platforms', through: { attributes: [] } },
      ],
      limit: Number(pageSize),
      offset: (Number(page)-1)*Number(pageSize),
      order
    });
    const rows = await Promise.all(items.rows.map(async it => {
      const avg = await Rating.findAll({
        attributes: [[Item.sequelize.fn('AVG', Item.sequelize.col('stars')), 'avgStars']],
        where: { item_id: it.id },
        raw: true
      });
      const avgStars = avg && avg[0] && avg[0].avgStars ? Number(parseFloat(avg[0].avgStars).toFixed(1)) : 0;
      return { ...it.toJSON(), avgRating: avgStars };
    }));
    res.json({ total: items.count, items: rows });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Detail
router.get('/:id', async (req, res) => {
  try {
    const it = await Item.findByPk(req.params.id, {
      include: [
        { model: Actor, as: 'actors', through: { attributes: [] } },
        { model: Platform, as: 'platforms', through: { attributes: [] } },
        { model: User, as: 'owner', attributes: ['id','name','username'] },
        { model: Comment, attributes: ['id','user_id','message','created_at'], order: [['created_at','DESC']] }
      ]
    });
    if(!it) return res.status(404).json({ error: 'Not found' });
    const avg = await Rating.findAll({
      attributes: [[Item.sequelize.fn('AVG', Item.sequelize.col('stars')), 'avgStars']],
      where: { item_id: it.id },
      raw: true
    });
    const avgStars = avg && avg[0] && avg[0].avgStars ? Number(parseFloat(avg[0].avgStars).toFixed(1)) : 0;
    res.json({ ...it.toJSON(), avgRating: avgStars });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Create (auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const body = req.body;
    const item = await Item.create({
      title: body.title,
      type: body.type || 'movie',
      genre: body.genre,
      synopsis: body.synopsis,
      release_date: body.release_date || null,
      director: body.director,
      rating_age: body.rating_age,
      image_url: body.image_url,
      owner_id: req.user.id
    });
    if(body.platforms && Array.isArray(body.platforms)){
      for(const pName of body.platforms){
        let platform = await Platform.findOne({ where: { name: pName }});
        if(!platform) platform = await Platform.create({ name: pName });
        await ItemPlatform.create({ item_id: item.id, platform_id: platform.id });
      }
    }
    res.status(201).json(item);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if(!item) return res.status(404).json({ error: 'Not found' });
    if(item.owner_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if(!item) return res.status(404).json({ error: 'Not found' });
    if(item.owner_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await item.destroy();
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
