const db = require("../config/db");

const User = {

  /* ================= FIND BY EMAIL ================= */
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  /* ================= FIND BY NAME OR EMAIL ================= */
  findByNameOrEmail: async (name, email) => {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE name = ? OR email = ?",
      [name, email]
    );
    return rows[0];
  },

  /* ================= CREATE USER ================= */
  create: async (data) => {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [data.name, data.email, data.password]
    );
    return { id: result.insertId, ...data };
  },

  /* ================= GET ALL USERS ================= */
  findAll: async () => {
    const [rows] = await db.execute(
      "SELECT id, name, email, created_at FROM users"
    );
    return rows;
  },

  /* ================= GET USER BY ID ================= */
  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  /* ================= UPDATE USER ================= */
  update: async (id, data) => {
    await db.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [data.name, data.email, id]
    );
    return { id, ...data };
  },

  /* ================= DELETE USER ================= */
  delete: async (id) => {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
  }
};

module.exports = User;
