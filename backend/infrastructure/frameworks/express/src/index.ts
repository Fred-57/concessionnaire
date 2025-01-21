import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { BrandRouter } from "./routers/BrandRouter";
import { ModelRouter } from "./routers/ModelRouter";
import { connect } from "@infrastructure/repositories/mongodb";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/brands", BrandRouter);
app.use("/models", ModelRouter);

// Error handling
app.use(errorHandler);

// MongoDB
connect(process.env.MONGODB_URI!);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
