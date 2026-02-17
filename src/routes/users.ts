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
  const { name, age, sex } = req.body;
  if (!name || !age || !sex) return res.status(400).json({ error: "Name, age, and sex required" });

  if (typeof name !== "string" || typeof age !== "number" || !['Male', 'Female'].includes(sex)) {
    return res.status(400).json({ error: "Invalid data types or values" });
  }

  const { data, error } = await supabase.from("users").insert([{ name, age, sex }]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json("User created successfully");
});

// DELETE user by ID
router.delete("/", async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await supabase.from("users").delete().eq("id", user_id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "User deleted"});
});
