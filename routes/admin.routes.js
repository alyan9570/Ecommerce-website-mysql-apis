const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("../models/admin.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const auth = require("../middleware/adminAuth");

dotenv.config();

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }
});

/* ================= ADMIN REGISTER ================= */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADMIN LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CREATE PRODUCT ================= */

router.post("/products", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.file) req.body.image = req.file.filename;

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE PRODUCT ================= */

router.put("/products/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.file) {
      if (existing.image) {
        fs.unlinkSync(path.join("uploads", existing.image));
      }
      req.body.image = req.file.filename;
    }

    await Product.updateById(req.params.id, req.body);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE PRODUCT ================= */

router.delete("/products/:id", auth, async (req, res) => {
  try {
    const product = await Product.deleteById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      fs.unlinkSync(path.join("uploads", product.image));
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CREATE CATEGORY ================= */

router.post("/categories", auth, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
