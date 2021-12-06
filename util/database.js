const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '07720772', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;    