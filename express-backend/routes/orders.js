const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const order = req.body;
    const newOrder = await orderModel.createOrder(order);
    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await orderModel.getAllOrdersWithLineItems();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading orders' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await orderModel.getAllOrdersWithProducts();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading orders' });
  }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
  try {
    const order = req.body;
    const orderId = req.params.id;
    const updatedOrder = await orderModel.updateOrder(orderId, order);
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    await orderModel.deleteOrder(orderId);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

module.exports = router;
