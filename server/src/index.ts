import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

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
