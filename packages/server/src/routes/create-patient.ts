import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod";
import { prisma } from "../utils/prisma";


export default async function createCostumer(app: FastifyInstance){
    app.post("/patient", CreateCostumerHandler)
}

export async function CreateCostumerHandler(request: FastifyRequest, reply: FastifyReply){
    const bodySchema = z.object({
        userId: z.string().uuid()
    })
    const {userId} = bodySchema.parse(request.body)
    
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    console.log(user)

    if(user == null){
        return reply.status(404).send({message: "User not found"})
    }

    await prisma.patient.create({
        data: {
            id: userId,
            userId: userId
        }
    })

    return reply.status(200)
}

