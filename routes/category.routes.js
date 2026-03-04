const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");

/* ================= GET ALL CATEGORIES ================= */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
