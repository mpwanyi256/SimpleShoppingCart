const Sequelize = require('sequelize');
const sequelize = require('../util/database');

/* 
  The shopping cart belongs to a user
  and it holds products with different quantities
*/

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
});

module.exports = Cart;
