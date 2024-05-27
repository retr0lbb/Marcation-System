import { prisma } from "./prisma"

async function clearDb() {
    await prisma.marcation.deleteMany()
    await prisma.costumer.deleteMany()
    // future prisma things here
}
clearDb()