import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import { number, string, z } from "zod";

export default async function createMedic(app: FastifyInstance){
    app.post("/admin/medic", createMedicHandler)
}

export const createMedicBodySchema = z.object({
    name: string(),
    medicalFunction: string(),
    especialization: string(),
    medicRoleId: number().int().positive().nullable()
})

export async function createMedicHandler(request: FastifyRequest, reply: FastifyReply){
    const {medicalFunction, especialization, name, medicRoleId} = createMedicBodySchema.parse(request.body)

    if(medicRoleId){
        const medicRole = await prisma.medicRoles.findUnique({
            where: {
                id: medicRoleId
            }
        })

        if(!medicRole){
            return reply.status(404).send({message: "medic role not found"})
        }
    }

    const result = await prisma.medic.create({
        data: {
            especialization,
            name,
            medicRolesId: medicRoleId
        }
    })

    return reply.status(201).send({message: `Medic: ${result.name} was inserted with sucess`, data: result})
}