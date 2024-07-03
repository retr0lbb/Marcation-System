import { prisma } from "./prisma"

async function clearDb() {
    await Promise.all([
        prisma.medic.deleteMany(),
        prisma.patient.deleteMany(),
        prisma.appointment.deleteMany(),
        prisma.especiality.deleteMany(),
        prisma.medicEspeciality.deleteMany()
    ])
    // future prisma things here

    console.log("all tables cleared")
}
clearDb()