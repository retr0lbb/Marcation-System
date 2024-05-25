import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function createUserHandler(request: FastifyRequest, reply: FastifyReply){
    const bodyParams = z.object({
        userName: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8).max(128)
    })

    
}

export async function CreateUser(app: FastifyInstance){
    app.post("/user", createUserHandler)
}