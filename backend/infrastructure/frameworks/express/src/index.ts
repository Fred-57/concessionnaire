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
import { RentalRouter } from "./routers/RentalRouter";

import { MaintenanceRouter } from "./routers/MaintenanceRouter";
import { BreakdownRouter } from "./routers/BreakdownRouter";
import { PartOrderHistoryRouter } from "./routers/PartOrderHistoryRouter";
import {
  PostgresDriverRepository,
  PostgresModelRepository,
  PostgresMotorcycleRepository,
  PostgresPartRepository,
  PostgresRentalRepository,
} from "@infrastructure/repositories/postgres";
import { MaintenanceCron } from "../../../cron/MaintenanceCron";
import { StockPartCron } from "../../../cron/StockPartCron";
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
app.use("/rentals", RentalRouter);
app.use("/maintenances", MaintenanceRouter);
app.use("/breakdowns", BreakdownRouter);
app.use("/partOrderHistory", PartOrderHistoryRouter);

// Error handling
app.use(errorHandler);

// Start cron
const maintenanceCron = new MaintenanceCron(
  new PostgresMotorcycleRepository(),
  new PostgresModelRepository(),
  new PostgresDriverRepository(),
  new PostgresRentalRepository()
);
maintenanceCron.start();

const stockPartCron = new StockPartCron(new PostgresPartRepository());
stockPartCron.start();

// MongoDB
connect(process.env.MONGODB_URI!);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
