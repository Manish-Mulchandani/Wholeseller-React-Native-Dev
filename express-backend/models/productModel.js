const db = require('../db/db');

// Create a new product
const createProduct = async (product) => {
  const query = {
    text: 'INSERT INTO products (name, price, available, image) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [product.name, product.price, product.available, product.image],
  };

  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all products
const getAllProducts = async () => {
  const query = 'SELECT * FROM products';

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Update a product by ID
const updateProduct = async (productId, product) => {
  const query = {
    text: 'UPDATE products SET name = $1, price = $2, available = $3, image = $4 WHERE id = $5 RETURNING *',
    values: [product.name, product.price, product.available, product.image, productId],
  };

  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  const query = {
    text: 'DELETE FROM products WHERE id = $1',
    values: [productId],
  };

  try {
    await db.query(query);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
