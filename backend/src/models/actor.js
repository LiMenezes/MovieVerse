const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('actor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    bio: { type: DataTypes.TEXT },
    photo_url: { type: DataTypes.STRING(800) }
  }, { tableName: 'actors', timestamps: false });
};
