import { prisma } from "./prisma"

async function clearDb() {
    await Promise.all([
        prisma.medic.deleteMany(),
        prisma.patient.deleteMany(),
        prisma.appointment.deleteMany(),
        prisma.medicRoles.deleteMany(),
    ])
    // future prisma things here

    console.log("all tables cleared")
}
clearDb()