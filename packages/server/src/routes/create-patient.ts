import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";
import ValidationError from "../_errors/validationError";

export async function CreateCostumerHandler(request: FastifyRequest, reply: FastifyReply){
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        contatcPhone: z.string(),
    })

    const {success, data, error} = bodySchema.safeParse(request.body)

    if(!success){
        new ValidationError(error)
        return reply.status(500).send({message: "Validation Error"})
    }
    

    const awaitForEmail = await prisma.patient.findFirst({
        where: {
            email: data.email
        }
    })

    if(awaitForEmail !== null){
        return reply.status(400).send({message: "Sorry other patient already used this email"})
    }

    const results = await prisma.patient.create({
        data: {
            contatcPhone: data?.contatcPhone,
            email: data?.email,
            name: data?.name
            
        }
    })
    return reply.status(201).send({message: "Costumer created with success", data:results})
}

export async function CreateCostumer(app: FastifyInstance){
    app.post("/patient", CreateCostumerHandler)
}