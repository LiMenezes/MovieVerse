const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    item_id: { type: DataTypes.INTEGER },
    stars: { type: DataTypes.TINYINT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'ratings', timestamps: false, indexes: [{ unique: true, fields: ['user_id','item_id'] }] });
};
