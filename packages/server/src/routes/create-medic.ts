import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import { string, z } from "zod";


export default async function createMedic(app: FastifyInstance){
    app.post("/admin/medic", createMedicHandler)
}

export const createMedicBodySchema = z.object({
    name: string(),
    medicalFunction: string(),
    especialization: string()
})

export async function createMedicHandler(request: FastifyRequest, reply: FastifyReply){
    const {medicalFunction, especialization, name} = createMedicBodySchema.parse(request.body)

    const result = await prisma.medic.create({
        data: {
            especialization,
            medicalFunction,
            name,
        }
    })


    return reply.status(201).send({message: `Medic: ${result.name} was inserted with sucess`, data: result})
}