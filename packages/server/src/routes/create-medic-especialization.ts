import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";

export default async function createMedicEspecialization(app: FastifyInstance) {
    app.post("/medic/role", createMedicEspecializationHandler)
}

export async function createMedicEspecializationHandler(request: FastifyRequest, reply: FastifyReply){
    const createMedicEspecializationSchema = z.object({
        name: z.string()
    })

    const { name } = createMedicEspecializationSchema.parse(request.body)

    const esp = await prisma.especiality.create({
        data: {
            name: name
        }
    })


    return reply.status(200).send({message: "Category created with sucess", data: esp})
}