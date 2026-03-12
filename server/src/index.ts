import app from "./app.js";
import { env } from "./config/env.schema.js";
import { prisma } from "./lib/prisma.js";

const PORT = env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log("app is listening on port ", PORT);
    });
  } catch (error) {
    console.log("server startup failed : ", error);
    process.exit(1);
  }
}

startServer();
