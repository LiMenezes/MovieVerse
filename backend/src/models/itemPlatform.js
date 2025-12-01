const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('item_platform', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true },
    platform_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, { tableName: 'item_platforms', timestamps: false });
};
