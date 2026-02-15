import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
//from neondb
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({
  connectionString,
});
//prisma client instance
const prisma = new PrismaClient({
  adapter,
  //log level
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
//connect and disconnect explicitly
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected to prisma");
  } catch (err) {
    console.log(`Database connection error: ${err}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { connectDB, disconnectDB, prisma };
