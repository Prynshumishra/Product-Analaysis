import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./utils/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`Backend server listening on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Closing server gracefully.`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
app.get("/", (req, res) => {
  res.send("🚀 Product Analytics API is running");
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));