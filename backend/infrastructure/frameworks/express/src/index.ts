import { connect } from "@infrastructure/repositories/mongodb";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { CompanyRouter } from "./routers/CompanyRouter";
import { ModelRouter } from "./routers/ModelRouter";
import { MotorcycleRouter } from "./routers/MotorcycleRouter";
import { PartRouter } from "./routers/PartRouter";
import { GuaranteeRouter } from "./routers/GuaranteeRouter";
import { DriverRouter } from "./routers/DriverRouter";
import { extractCompanyId } from "./middlewares/headerHandler";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/drivers", extractCompanyId);

// Routers
app.use("/companies", CompanyRouter);
app.use("/drivers", DriverRouter);
app.use("/models", ModelRouter);
app.use("/motorcycles", MotorcycleRouter);
app.use("/parts", PartRouter);
app.use("/guarantees", GuaranteeRouter);

// Error handling
app.use(errorHandler);

// MongoDB
connect(process.env.MONGODB_URI!);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
