const express = require('express');
const { createProduct, updateProduct, deleteProduct, getAllProducts } = require('../controllers/productController');
const { verifyToken, isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, isMerchant, createProduct);
router.put('/:id', verifyToken, isMerchant, updateProduct);
router.delete('/:id', verifyToken, isMerchant, deleteProduct);
router.get('/', getAllProducts);

module.exports = router;
