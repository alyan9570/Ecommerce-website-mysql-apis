const db = require("../config/db");

const Product = {
 create: async (data) => {
  const [result] = await db.execute(
    `INSERT INTO products (name, price, image, category_id, description,quantity)
     VALUES (?, ?, ?, ?,?,?)`,
    [
      data.name,
      Number(data.price),
      data.image || null,
      Number(data.category_id),
      data.description,
      Number(data.quantity)
    ]
  );

  return { id: result.insertId };
},

  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  updateById: async (id, data) => {
    await db.execute(
      "UPDATE products SET name=?, price=?, image=? WHERE id=?",
      [data.name, data.price, data.image, id]
    );
    return true;
  },

  deleteById: async (id) => {
    const product = await Product.findById(id);
    await db.execute("DELETE FROM products WHERE id=?", [id]);
    return product;
  },
   /* ================= GET ALL PRODUCTS ================= */
  findAll: async () => {
    const [rows] = await db.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id`
    );
    return rows;
  },
   /* ================= GET PRODUCTS BY CATEGORY ================= */
  findByCategory: async (categoryId) => {
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE category_id = ?`,
      [categoryId]
    );
    return rows;
  }
};

module.exports = Product;
