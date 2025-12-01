const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('platform', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false, unique: true }
  }, { tableName: 'platforms', timestamps: false });
};
