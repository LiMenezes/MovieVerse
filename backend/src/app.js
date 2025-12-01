const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const commentsRoutes = require('./routes/comments');
const ratingsRoutes = require('./routes/ratings');
const favoritesRoutes = require('./routes/favorites');
const usersRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);
app.use('/comments', commentsRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/users', usersRoutes);

// health
app.get('/', (req,res) => res.json({ ok: true, service: 'movieverse-api' }));

module.exports = app;
