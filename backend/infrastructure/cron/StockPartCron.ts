import { PostgresPartRepository } from "../repositories/postgres";
import { CronJob } from "cron";
import nodemailer from "nodemailer";
import { Part } from "../../domain/entities/Part";
export class StockPartCron {
  private readonly minStock = 10;
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly partRepository: PostgresPartRepository) {
    this.transporter = nodemailer.createTransport({
      host: "localhost", // Mailpit tourne en local
      port: 1025, // Port SMTP de Mailpit
      secure: false, // Mailpit n'utilise pas SSL/TLS
    });
  }

  public start(): void {
    // Exécution toutes les heures
    new CronJob("0 * * * *", async () => {
      await this.checkStockParts();
    }).start();
  }

  private async checkStockParts(): Promise<void> {
    const parts = await this.partRepository.findAll();
    for (const part of parts) {
      if (part.stock.value < this.minStock) {
        await this.sendEmail(part);
      }
    }
  }

  private async sendEmail(part: Part): Promise<void> {
    const mailOptions = {
      from: "noreply@example.com",
      to: "admin@example.com",
      subject: "Alerte de stock bas",
      text: `La pièce ${part.name.value} est en rupture de stock. Il ne reste plus que ${part.stock.value} pièces.`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
