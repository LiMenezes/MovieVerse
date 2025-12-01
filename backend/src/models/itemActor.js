const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('item_actor', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true },
    actor_id: { type: DataTypes.INTEGER, primaryKey: true },
    role_name: { type: DataTypes.STRING(200) }
  }, { tableName: 'item_actors', timestamps: false });
};
