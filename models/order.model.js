const db = require("../config/db");

const Order = {

  /* ================= CREATE ORDER ================= */
  create: async ({ userId, items, totalAmount, paymentMethod }) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert order
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (user_id, total_amount, payment_method)
         VALUES (?, ?, ?)`,
        [userId, totalAmount, paymentMethod]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (let item of items) {
        await conn.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      await conn.commit();
      return { id: orderId, userId, totalAmount, paymentMethod, items };

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /* ================= GET ORDERS BY USER ================= */
  findByUser: async (userId) => {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return orders;
  },

  /* ================= GET ORDER BY ID ================= */
  findByIdAndUser: async (orderId, userId) => {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) return null;

    const [items] = await db.execute(
      `SELECT product_id, quantity, price FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return { ...orders[0], items };
  }
};

module.exports = Order;
