const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productModel.createProduct(product);
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading products' });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const product = req.body;
    const productId = req.params.id;
    const updatedProduct = await productModel.updateProduct(productId, product);
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await productModel.deleteProduct(productId);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
