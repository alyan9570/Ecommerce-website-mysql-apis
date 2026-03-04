const express = require("express");
const cors = require("cors");
const { MulterError } = require("multer");

// MySQL connection (mysql2 pool)
const db = require("./config/db");

// Routes
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const adminRoutes = require("./routes/admin.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

/* ================= TEST MYSQL CONNECTION ================= */
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

/* ================= MIDDLEWARE ================= */
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* ================= ROUTES ================= */
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);
app.use("/orders", orderRoutes);

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

/* ================= START SERVER ================= */
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
