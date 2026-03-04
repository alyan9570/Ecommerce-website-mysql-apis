const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/cart.model");

/* ================= GET ALL CARTS ================= */
router.get("/", auth, async (req, res) => {
  const carts = await Cart.findAll();
  res.json(carts);
});

/* ================= GET CART BY ID ================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CREATE CART ================= */
router.post("/", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.create(userId);
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD TO CART ================= */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findByUserId(userId);

    if (!cart) {
      cart = await Cart.create(userId);
    }

    await Cart.addProduct(cart.id, productId, quantity);
    const updatedCart = await Cart.findById(cart.id);

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= REMOVE FROM CART ================= */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await Cart.removeProduct(cart.id, productId);
    const updatedCart = await Cart.findById(cart.id);

    res.json({
      message: "Product removed successfully",
      cart: updatedCart
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE CART ================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Cart.deleteById(req.params.id);
    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
