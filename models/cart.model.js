const db = require("../config/db");

const Cart = {

  /* ================= GET ALL CARTS ================= */
  findAll: async () => {
    const [rows] = await db.execute(`
      SELECT c.id, c.user_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'productId', ci.product_id,
          'quantity', ci.quantity
        )
      ) AS product
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      GROUP BY c.id
    `);
    return rows;
  },

  /* ================= GET CART BY ID ================= */
  findById: async (id) => {
    const [rows] = await db.execute(`
      SELECT c.id, c.user_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'productId', ci.product_id,
          'quantity', ci.quantity
        )
      ) AS product
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    return rows[0];
  },

  /* ================= FIND CART BY USER ================= */
  findByUserId: async (userId) => {
    const [rows] = await db.execute(
      "SELECT * FROM carts WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0];
  },

  /* ================= CREATE CART ================= */
  create: async (userId) => {
    const [result] = await db.execute(
      "INSERT INTO carts (user_id) VALUES (?)",
      [userId]
    );
    return { id: result.insertId, userId };
  },

  /* ================= ADD PRODUCT ================= */
  addProduct: async (cartId, productId, quantity) => {
    await db.execute(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
      [cartId, productId, quantity]
    );
  },

  /* ================= REMOVE PRODUCT ================= */
  removeProduct: async (cartId, productId) => {
    await db.execute(
      "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, productId]
    );
  },
     findByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT product_id, quantity
       FROM cart_items
       WHERE user_id = ?`,
      [userId]
    );

    // ALWAYS return products array even if empty
    return {
      userId,
      products: rows.map(row => ({
        productId: row.product_id,
        quantity: row.quantity
      }))
    };
  },

  /* ========== CLEAR CART ========== */
  clear: async (userId) => {
    await db.execute(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [userId]
    );
  },

  /* ================= DELETE CART ================= */
  deleteById: async (id) => {
    await db.execute("DELETE FROM carts WHERE id = ?", [id]);
  }
};

module.exports = Cart;
