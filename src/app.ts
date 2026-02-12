import express from "express";
import { router as cartRouter } from "./routes/cart";

const app = express();
app.use(express.json());
app.use("/cart", cartRouter);

export { app };
