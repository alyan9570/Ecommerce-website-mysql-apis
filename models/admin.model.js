// models/admin.model.js
const db = require("../config/db");

const Admin = {
  create: async ({ name, email, password }) => {
    const [result] = await db.execute(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return { id: result.insertId, name, email };
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0];
  }
};

module.exports = Admin;
