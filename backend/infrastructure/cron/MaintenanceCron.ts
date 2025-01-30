import { CronJob } from "cron";
import {
  PostgresDriverRepository,
  PostgresModelRepository,
  PostgresMotorcycleRepository,
  PostgresRentalRepository,
} from "../repositories/postgres";
import nodemailer from "nodemailer";

export class MaintenanceCron {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly motorcycleRepository: PostgresMotorcycleRepository,
    private readonly modelRepository: PostgresModelRepository,
    private readonly driverRepository: PostgresDriverRepository,
    private readonly rentalRepository: PostgresRentalRepository
  ) {
    this.transporter = nodemailer.createTransport({
      host: "localhost", // Mailpit tourne en local
      port: 1025, // Port SMTP de Mailpit
      secure: false, // Mailpit n'utilise pas SSL/TLS
    });
  }

  public start(): void {
    // Exécution toutes les minutes
    new CronJob("* * * * *", async () => {
      await this.checkMaintenances();
    }).start();
  }

  private async checkMaintenances(): Promise<void> {
    try {
      const motorcycles = await this.motorcycleRepository.findAll();

      for (const motorcycle of motorcycles) {
        const model = await this.modelRepository.findByIdentifier(
          motorcycle.modelIdentifier
        );

        if (model instanceof Error || !model) {
          throw model;
        }

        if (
          (motorcycle.mileage.value >= model.repairMileage ||
            model.repairDeadline.value < new Date().getTime()) &&
          (model.rappelSendAt === null ||
            model.rappelSendAt.getTime() <
              new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
        ) {
          const rentals = await this.rentalRepository.findAll();

          for (const rental of rentals) {
            if (rental.motorcycleIdentifier === motorcycle.identifier) {
              const driver = await this.driverRepository.findByIdentifier(
                rental.driverIdentifier
              );

              if (driver instanceof Error || !driver) {
                throw driver;
              }

              await this.transporter.sendMail({
                from: "noreply@gmail.com",
                to: driver.name.value + "@gmail.com",
                subject: "Maintenance Requise",
                text: `La moto ${motorcycle.identifier} nécessite une maintenance. Vous pouvez la réserver sur notre site web.`,
              });

              await this.transporter.sendMail({
                from: "noreply@gmail.com",
                to: "admin@gmail.com",
                subject: "Maintenance Requise",
                text: `La moto ${motorcycle.identifier} nécessite une maintenance. Le client ${driver.name.value} a été notifié.`,
              });

              await this.modelRepository.updateRappelSendAt(model, new Date());
            }
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'exécution du cron de maintenance:",
        error
      );
    }
  }
}
