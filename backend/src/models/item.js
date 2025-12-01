const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.STRING(50), defaultValue: 'movie' },
    genre: { type: DataTypes.STRING(255) },
    synopsis: { type: DataTypes.TEXT },
    release_date: { type: DataTypes.DATEONLY },
    director: { type: DataTypes.STRING(200) },
    rating_age: { type: DataTypes.STRING(20) },
    image_url: { type: DataTypes.STRING(800) },
    owner_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'items', timestamps: false });
};
