import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { connect } from "@infrastructure/repositories/mongodb";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  connect(process.env.MONGODB_URI);
}
bootstrap();
