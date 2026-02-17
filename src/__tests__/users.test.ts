import request from "supertest";
import express from "express";
import { router as usersRouter } from "../routes/users";
import { supabase } from "../supabaseClient";

jest.mock("../supabaseClient");

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

describe("Users Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // GET /users
  // =====================
  describe("GET users", () => {
    it("should return all users", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 1, name: "John" }],
          error: null,
        }),
      });

      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: "John" }]);
    });

    it("should return error on db error", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "DB error" },
        }),
      });

      const res = await request(app).get("/users");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  // =====================
  // POST /users
  // =====================
  describe("POST users", () => {
    it("should create a user", async () => {
        (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
                data: { id: 1, name: "Jane", age: 22, sex: "Female" },
                error: null,
            }),
            }),
        }),
        });


      const res = await request(app)
        .post("/users")
        .send({ id: 1, name: "Jane", age: 22, sex: "Female" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual("User created successfully");
    });

    it("should fail if there are missing values", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "Jane" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Name, age, and sex required");
    });

    it("should fail if there are invalid data types or values", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "Jane", age: "twenty-two", sex: "Unknown" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid data types or values");
    });
  });

  // =====================
  // DELETE /users
  // =====================
  describe("DELETE users", () => {
    it("should delete a user given a user_id", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      const res = await request(app)
        .delete("/users")
        .send({ user_id: 1 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User deleted");
    });

    it("should return error on delete failure", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Delete failed" },
          }),
        }),
      });

      const res = await request(app)
        .delete("/users")
        .send({ user_id: 1 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Delete failed");
    });
  });
});
