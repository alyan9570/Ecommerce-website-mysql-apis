const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

/* ================= GET ALL PRODUCTS ================= */
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET SINGLE PRODUCT ================= */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET PRODUCTS BY CATEGORY ================= */
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.findByCategory(req.params.categoryId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
