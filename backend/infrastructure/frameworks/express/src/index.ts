import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
