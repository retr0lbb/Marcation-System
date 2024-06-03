import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";

export async function CreateCostumerHandler(request: FastifyRequest, reply: FastifyReply){
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        contatcPhone: z.string(),
        motivation: z.string()
    })

    const {contatcPhone, email, motivation, name} = bodySchema.parse(request.body)

    const awaitForEmail = await prisma.patient.findFirst({
        where: {
            email: email
        }
    })

    if(awaitForEmail){
        return reply.status(400).send({message: "Some other user already have this email"})
    }

    const results = await prisma.patient.create({
        data: {
            contatcPhone,
            email,
            motivation,
            name
        }
    })
    return reply.status(201).send({message: "Costumer created with success", data:results})
}

export async function CreateCostumer(app: FastifyInstance){
    app.post("/patient", CreateCostumerHandler)
}