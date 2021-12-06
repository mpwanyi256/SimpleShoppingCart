const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // req.user.createProduct method here is enabled by the sequelize 
  // relationship we added between a user and products in app.js

  req.user.createProduct({
    title,
    price,
    imageUrl,
    description
  }).then(() => {
    console.log('New product was created');
    res.redirect('/admin/products');
  }).catch(err => {
    console.log('Error while creating product', err);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  // The req.user.getProducts comes off the user relationship

  req.user.getProducts({ where: { id: prodId } })
  // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(() => {
      return res.redirect('/');
    })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;

      // Return the save promise
      return product.save(); 
    }).then(() => {
      res.redirect('/admin/products');
    }).catch(e => {
      console.log('Error updating product', e);
    });
};

exports.getProducts = (req, res, next) => {
  // Product.findAll() -> returns all products

  // req.user.getProducts() returns products specific to this user
    req.user.getProducts()
      .then(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products'
        });
      }).catch(e => {
        console.error('Error fetching products', e);
      });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    }).then(() => {
      console.log('Deleted product');
      res.redirect('/admin/products');
    }).catch(e => {
      console.log('Error while deleting product', e);
    })
};
