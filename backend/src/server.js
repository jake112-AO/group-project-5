import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";

async function bootstrap() {
  await connectDb(env.mongoUri);
  const app = createApp();
  app.listen(env.port, () => {

    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {

  console.error("Failed to boot server", err);
  process.exit(1);
});
