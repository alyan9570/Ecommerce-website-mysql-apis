const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");     // MySQL version
const Product = require("../models/product.model"); // MySQL version


/* ================= CREATE ORDER ================= */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findByUser(userId);
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    let totalAmount = 0;
    let items = [];

    for (let item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const price = product.price;
      const quantity = item.quantity;

      totalAmount += price * quantity;

      items.push({
        productId: item.productId,
        quantity,
        price
      });
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod: req.body.paymentMethod || "COD"
    });

    // Clear cart
    await Cart.clear(userId);

    res.status(201).json({
      msg: "Order created successfully",
      order
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ================= GET USER ORDERS ================= */
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= GET ORDER BY ID ================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUser(
      req.params.id,
      req.user.id
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
