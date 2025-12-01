const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    item_id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING(200) },
    message: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'comments', timestamps: false });
};
