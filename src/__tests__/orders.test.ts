import request from "supertest";
import express from "express";
import { router as ordersRouter } from "../routes/orders";
import { supabase } from "../supabaseClient";

jest.mock("../supabaseClient");

const app = express();
app.use(express.json());
app.use("/orders", ordersRouter);

describe("Orders Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // GET /orders
  // =====================
  it("GET /orders (happy path)", async () => {
    const mockOrders = [
      { id: 1, user_id: 1, address_id: 1, product_name: "Laptop", quantity: 1, price: 999 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
    });

    const res = await request(app).get("/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrders);
  });

  it("GET /orders (sad path - DB error)", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: { message: "DB failure" } }),
    });

    const res = await request(app).get("/orders");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("DB failure");
  });

  // =====================
  // POST /orders
  // =====================
  it("POST /orders (happy path)", async () => {
    const newOrder = { user_id: 1, address_id: 1, product_name: "Mouse", quantity: 2, price: 25 };
    const mockResponse = { id: 2, ...newOrder };

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
    });

    const res = await request(app).post("/orders").send(newOrder);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockResponse);
  });

  it("POST /orders (sad path - missing fields)", async () => {
    const res = await request(app).post("/orders").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });

  // =====================
  // DELETE /orders
  // =====================
  it("DELETE /orders (happy path)", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    const res = await request(app).delete("/orders").send({ order_id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order deleted");
  });

  it("DELETE /orders (sad path - missing order_id)", async () => {
    const res = await request(app).delete("/orders").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("order_id required");
  });
});
