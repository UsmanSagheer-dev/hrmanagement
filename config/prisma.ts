import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully!");
  } catch (error) {
    console.error("Error connecting to Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrismaConnection();
