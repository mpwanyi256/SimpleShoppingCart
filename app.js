const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const errorController = require('./controllers/error');

// Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// To remove this once we have Auth
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(e => {
            console.log('Error fetching a user', e);
            next();
        });
});
// End auth refactor

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Relations User.createProduct()
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Cart relations
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem }); // CartItem stores productId & Cart Id
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
// .sync()
.sync({ merge: true })
.then(() => {
    return User.findByPk(1);
})
.then(user => {
    if (!user) {
        return User.create({
            name: 'Samuel Mpwanyi',
            email: 'samuel@bposeats.com'
        })
    }
    return Promise.resolve(user);
})
.then(user => {
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(e => {
    console.log('sequelize error', e);
});

