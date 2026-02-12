import { Router } from "express";
import { supabase } from "../supabaseClient";

export const router = Router();

// GET all addresses
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("address").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST a new address
router.post("/", async (req, res) => {
  const { user_id, full_address } = req.body;
  if (!user_id || !full_address) return res.status(400).json({ error: "user_id and full_address required" });

  const { data, error } = await supabase.from("address").insert([{ user_id, full_address }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
});

// DELETE all addresses
router.delete("/", async (req, res) => {
  const { data, error } = await supabase.from("address").delete().neq("id", 0);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "All addresses deleted", deleted: data.length });
});
