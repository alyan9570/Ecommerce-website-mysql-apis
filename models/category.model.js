const db = require("../config/db");

const Category = {
  create: async (data) => {
    const [result] = await db.execute(
      "INSERT INTO categories (name) VALUES (?)",
      [data.name]
    );
    return { id: result.insertId, ...data };
  },

    /* ================= GET ALL CATEGORIES ================= */
    findAll: async () => {
    const [rows] = await db.execute(
      "SELECT id, name FROM categories"
    );
    return rows;
  }
};

module.exports = Category;
