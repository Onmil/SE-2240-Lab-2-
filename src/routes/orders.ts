import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const router = Router();

// =====================
// GET /orders
// =====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json("No orders found");
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// POST /orders
// =====================
router.post('/', async (req: Request, res: Response) => {
  const { user_id, address_id, product_name, quantity, price } = req.body;

  if (!user_id || !address_id || !product_name || !quantity || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ user_id, address_id, product_name, quantity, price }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// DELETE /orders
// =====================
router.delete('/', async (req: Request, res: Response) => {
  const { order_id } = req.body;

  if (!order_id) return res.status(400).json({ error: "order_id required" });

  try {
    const { data, error } = await supabase.from('orders').delete().eq('id', order_id);
    if (error) throw error;

    res.status(200).json({ message: "Order deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
