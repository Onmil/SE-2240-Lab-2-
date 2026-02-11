import { Router } from "express";

export const router = Router();

let cart: string[] = [];

router.get("/", (req, res) => {
  res.json(cart);
});

router.post("/", (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ error: "Item required" });
  cart.push(item);
  res.status(201).json({ message: "Item added", cart });
});

router.delete("/", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared" });
});
