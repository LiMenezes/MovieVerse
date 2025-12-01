const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    item_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'favorites', timestamps: false, indexes: [{ unique: true, fields: ['user_id','item_id'] }] });
};
