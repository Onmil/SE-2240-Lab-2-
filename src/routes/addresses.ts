import { Router } from "express";
import { supabase } from "../supabaseClient";

export const router = Router();

// GET address by user_id
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }

  const { data, error } = await supabase.from("address").select("*").eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
  return res.status(404).json("User not found or no addresses");
}


  res.json(data ?? []);
});

// POST a new address a
router.post("/", async (req, res) => {
  const { user_id, full_address } = req.body;

  if (!user_id || !full_address) {
    return res.status(400).json({ error: "user_id and full_address required" });
  }

  const { data, error } = await supabase
    .from("address")
    .insert({ user_id, full_address })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});



router.delete("/", async (req, res) => {
  const { address_id } = req.body;

  if (!address_id) {
    return res.status(400).json({ error: "address_id required" });
  }

  const { error } = await supabase
    .from("address")
    .delete()
    .eq("id", address_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Address deleted" });
});

