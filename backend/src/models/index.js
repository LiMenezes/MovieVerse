const sequelize = require('../config/database');
const User = require('./user');
const Item = require('./item');
const Actor = require('./actor');
const ItemActor = require('./itemActor');
const Platform = require('./platform');
const ItemPlatform = require('./itemPlatform');
const Comment = require('./comment');
const Rating = require('./rating');
const Favorite = require('./favorite');

const models = {
  User: User(sequelize),
  Item: Item(sequelize),
  Actor: Actor(sequelize),
  ItemActor: ItemActor(sequelize),
  Platform: Platform(sequelize),
  ItemPlatform: ItemPlatform(sequelize),
  Comment: Comment(sequelize),
  Rating: Rating(sequelize),
  Favorite: Favorite(sequelize)
};

models.User.hasMany(models.Item, { foreignKey: 'owner_id', as: 'items' });
models.Item.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });

models.Item.belongsToMany(models.Actor, { through: models.ItemActor, foreignKey: 'item_id', otherKey: 'actor_id', as: 'actors' });
models.Actor.belongsToMany(models.Item, { through: models.ItemActor, foreignKey: 'actor_id', otherKey: 'item_id', as: 'items' });

models.Item.belongsToMany(models.Platform, { through: models.ItemPlatform, foreignKey: 'item_id', otherKey: 'platform_id', as: 'platforms' });
models.Platform.belongsToMany(models.Item, { through: models.ItemPlatform, foreignKey: 'platform_id', otherKey: 'item_id', as: 'items' });

models.User.hasMany(models.Comment, { foreignKey: 'user_id' });
models.Item.hasMany(models.Comment, { foreignKey: 'item_id' });
models.Comment.belongsTo(models.User, { foreignKey: 'user_id' });
models.Comment.belongsTo(models.Item, { foreignKey: 'item_id' });

models.User.hasMany(models.Rating, { foreignKey: 'user_id' });
models.Item.hasMany(models.Rating, { foreignKey: 'item_id' });
models.Rating.belongsTo(models.User, { foreignKey: 'user_id' });
models.Rating.belongsTo(models.Item, { foreignKey: 'item_id' });

models.User.hasMany(models.Favorite, { foreignKey: 'user_id' });
models.Item.hasMany(models.Favorite, { foreignKey: 'item_id' });
models.Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
models.Favorite.belongsTo(models.Item, { foreignKey: 'item_id' });

module.exports = { sequelize, ...models };
