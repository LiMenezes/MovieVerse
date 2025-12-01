const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || 'movieverse',
  process.env.DATABASE_USER || 'root',
  process.env.DATABASE_PASS || '',
  {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: false
    },
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
);

module.exports = sequelize;
