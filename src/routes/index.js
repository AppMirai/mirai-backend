const express = require('express');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');
const brandController = require('../controllers/brandController');
const categoryController = require('../controllers/categoryController');
const bannerController = require('../controllers/bannerController');
const productController = require('../controllers/productController');
const productImageController = require('../controllers/productImageController');
const productShadeController = require('../controllers/productShadeController');
const productLikeController = require('../controllers/productLikeController');

const router = express();

// Index Router
router.get('/', (req, res) => {
    res.status(200).send("Mirai RestAPI 2022");
});

// Users
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.post('/users/change-password', authMiddleware, userController.change_password);
router.post('/users/update-profile', authMiddleware, userController.update_profile);
router.get('/users/profile', authMiddleware, userController.profile);

// Brands
router.get('/brands', brandController.index);
router.get('/brands/:id', brandController.show);
router.post('/brands/create', authMiddleware, brandController.create);
router.put('/brands/update/:id', authMiddleware, brandController.update);
router.delete('/brands/delete/:id', authMiddleware, brandController.destroy);

// Categories
router.get('/categories', categoryController.index);
router.get('/categories/:id', categoryController.show);
router.post('/categories/create', authMiddleware, categoryController.create);
router.put('/categories/update/:id', authMiddleware, categoryController.update);
router.delete('/categories/delete/:id', authMiddleware, categoryController.destroy);

// Banner Images
router.get('/banners', bannerController.index);
router.get('/banners/:id', bannerController.show);
router.post('/banners/create', authMiddleware, bannerController.create);
router.put('/banners/update/:id', authMiddleware, bannerController.update);
router.delete('/banners/delete/:id', authMiddleware, bannerController.destroy);

// Product Like
router.post('/products/like', authMiddleware, productLikeController.like);
router.post('/products/unlike', authMiddleware, productLikeController.unlike);
router.get('/products/likes', authMiddleware, productLikeController.index);
router.post('/products/like/check', authMiddleware, productLikeController.check_like);

// Products
router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/products/create', authMiddleware, productController.create);
router.put('/products/update/:id', authMiddleware, productController.update);
router.delete('/products/delete/:id', authMiddleware, productController.destroy);

// Products Images
router.get('/products/:id/images/:idImage', authMiddleware, productImageController.show);
router.post('/products/:id/images/create', authMiddleware, productImageController.create);
router.put('/products/:id/images/update/:idImage', authMiddleware, productImageController.update);
router.delete('/products/:id/images/delete/:idImage', authMiddleware, productImageController.destroy);

// Products Shades
router.get('/products/:id/shades/:idShade', authMiddleware, productShadeController.show);
router.post('/products/:id/shades/create', authMiddleware, productShadeController.create);
router.put('/products/:id/shades/update/:idShade', authMiddleware, productShadeController.update);
router.delete('/products/:id/shades/delete/:idShade', authMiddleware, productShadeController.destroy);


module.exports = router;