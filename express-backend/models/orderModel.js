const db = require('../db/db');

const createOrder = async (order) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    // Create the order in the orders table
    const orderQuery = {
      text: 'INSERT INTO orders (customer_name, mobile_no) VALUES ($1, $2) RETURNING id',
      values: [order.customer_name, order.mobile_no],
    };

    const orderResult = await client.query(orderQuery);
    const orderId = orderResult.rows[0].id;

    // Insert order line items into the order_line_items table
    for (const lineItem of order.products_list) {
      const lineItemQuery = {
        text: 'INSERT INTO order_line_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        values: [orderId, lineItem.product_id, lineItem.quantity],
      };

      await client.query(lineItemQuery);
    }

    await client.query('COMMIT'); // Commit the transaction
    return orderId;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
};


// Create a new order
// const createOrder = async (order) => {
//   const query = {
//     text: 'INSERT INTO orders (customer_name, mobile_no, products_list) VALUES ($1, $2, $3) RETURNING *',
//     values: [order.customer_name, order.mobile_no, order.products_list],
//   };

//   try {
//     const result = await db.query(query);
//     return result.rows[0];
//   } catch (error) {
//     throw error;
//   }
// };

const getAllOrdersWithProducts = async () => {
  const query = `
    SELECT o.id AS order_id, o.customer_name, o.mobile_no,
      json_agg(json_build_object(
        'product_id', oli.product_id,
        'quantity', oli.quantity,
        'product_name', p.name,
        'product_price', p.price,
        'product_available', p.available,
        'product_image', p.image
      )) AS products
    FROM orders o
    LEFT JOIN order_line_items oli ON oli.order_id = o.id
    LEFT JOIN products p ON oli.product_id = p.id
    GROUP BY o.id, o.customer_name, o.mobile_no;
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};


// Get all orders with product details
const getAllOrdersWithLineItems = async () => {
  const query = `
    SELECT o.id, o.customer_name, o.mobile_no, 
           oli.product_id, oli.quantity,
           p.name, p.price, p.available, p.image
    FROM orders o
    INNER JOIN order_line_items oli ON oli.order_id = o.id
    INNER JOIN products p ON p.id = oli.product_id
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};



// Get all orders
// const getAllOrders = async () => {
//   const query = 'SELECT * FROM orders';

//   try {
//     const result = await db.query(query);
//     return result.rows;
//   } catch (error) {
//     throw error;
//   }
// };

// // Update an order by ID
// const updateOrder = async (orderId, order) => {
//   const query = {
//     text: 'UPDATE orders SET customer_name = $1, mobile_no = $2, products_list = $3 WHERE id = $4 RETURNING *',
//     values: [order.customer_name, order.mobile_no, order.products_list, orderId],
//   };

//   try {
//     const result = await db.query(query);
//     return result.rows[0];
//   } catch (error) {
//     throw error;
//   }
// };

// Delete an order by ID
const deleteOrder = async (orderId) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    // Delete order line items for the order
    const deleteLineItemsQuery = {
      text: 'DELETE FROM order_line_items WHERE order_id = $1',
      values: [orderId],
    };

    await client.query(deleteLineItemsQuery);

    // Delete the order from the orders table
    const deleteOrderQuery = {
      text: 'DELETE FROM orders WHERE id = $1',
      values: [orderId],
    };

    await client.query(deleteOrderQuery);

    await client.query('COMMIT'); // Commit the transaction
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
};


module.exports = {
  createOrder,
  getAllOrdersWithLineItems,
  getAllOrdersWithProducts,
  //updateOrder,
  deleteOrder,
};
