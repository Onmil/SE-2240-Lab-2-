import request from "supertest";
import { app } from "../app";

describe("Cart API", () => {
  it("GET /cart should return empty array", async () => {
    const res = await request(app).get("/cart");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /cart should add item", async () => {
    const res = await request(app).post("/cart").send({ item: "apple" });
    expect(res.status).toBe(201);
    expect(res.body.cart).toContain("apple");
  });

  it("DELETE /cart should clear cart", async () => {
    const res = await request(app).delete("/cart");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cart cleared");
  });
});
