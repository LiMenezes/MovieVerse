const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const router = express.Router();
const secret = process.env.JWT_SECRET || 'changeme';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if(!name||!username||!email||!password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ where: { [User.sequelize.Op.or]: [{ email }, { username }] }});
    if(exists) return res.status(409).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, password_hash: hash });
    const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, secret, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, username: user.username, email: user.email }, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if(!login||!password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ where: { [User.sequelize.Op.or]: [{ email: login }, { username: login }] }});
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, secret, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, username: user.username, email: user.email }, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
