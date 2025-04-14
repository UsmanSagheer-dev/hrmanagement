import { PrismaClient } from "@prisma/client";
import { toast } from "react-hot-toast";

export const prisma = new PrismaClient();

async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    toast.success("Prisma connected successfully!");
  } catch (error) {
    toast.error("Error connecting to Prisma!");
  } finally {
    await prisma.$disconnect();
  }
}

checkPrismaConnection();