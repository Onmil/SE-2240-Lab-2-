import request from "supertest";
import express from "express";
import { router as addressesRouter } from "../routes/addresses";
import { supabase } from "../supabaseClient";

jest.mock("../supabaseClient");

const app = express();
app.use(express.json());
app.use("/addresses", addressesRouter);

describe("Addresses Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // GET /addresses?user_id=...
  // =====================
  describe("GET addresses", () => {
    it("should return addresses linked to a user", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ id: 1, user_id: "123", full_address: "123 Main St" }],
            error: null,
          }),
        }),
      });

      const res = await request(app).get("/addresses").query({ user_id: "123" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, user_id: "123", full_address: "123 Main St" }]);
    });

    it("should return an error when the UID is not provided", async () => {
      const res = await request(app).get("/addresses");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("user_id required");
    });

    it("should return an error when the selected user is not found", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const res = await request(app).get("/addresses").query({ user_id: "1" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual("User not found or no addresses");
    })
  });

  // =====================
  // POST /addresses
  // =====================
  describe("POST addresses", () => {
    it("should create a new address for a user", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 1, user_id: "123", full_address: "123 Main St" },
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app)
        .post("/addresses")
        .send({ user_id: "123", full_address: "123 Main St" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 1, user_id: "123", full_address: "123 Main St" });
    });

    it("should return an error if user_id or full_address is missing", async () => {
      const res = await request(app).post("/addresses").send({ full_address: "123 Main St" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("user_id and full_address required");
    });
  });

  // =====================
  // DELETE /addresses
  // =====================
  describe("DELETE addresses", () => {
    it("should delete an address", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      const res = await request(app).delete("/addresses").send({ address_id: 1 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Address deleted");
    });

    it("should return an error when address ID is missings", async () => {
      const res = await request(app).delete("/addresses").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("address_id required");
    });
  });
});
