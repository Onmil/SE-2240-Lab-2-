    import { Router } from "express";
import { supabase } from "../supabaseClient";

export const router = Router();

// GET all users
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST a new user
router.post("/", async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(400).json({ error: "Name and age required" });

  const { data, error } = await supabase.from("users").insert([{ name, age }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
});

// DELETE all users
router.delete("/", async (req, res) => {
  const { data, error } = await supabase.from("users").delete().neq("id", 0);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "All users deleted", deleted: data.length });
});
