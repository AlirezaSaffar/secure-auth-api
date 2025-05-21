const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './secure_api.sqlite',
  logging: false,
});

module.exports = sequelize;

