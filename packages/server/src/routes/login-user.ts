import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";
import {compareHashedPassword} from "../utils/encrypt-pass"


export default async function logUserByEmail(app: FastifyInstance){
    app.post("/login/user", logUserByEmailHandler)
}

export async function  logUserByEmailHandler(request: FastifyRequest, reply: FastifyReply){
    const bodySchema = z.object({
        email: z.string(),
        password: z.string()
    })

    const {email, password} = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!user){
        return reply.status(404).send({message: "User not found"});
    }

    const comparedPass = await compareHashedPassword(password, user.password)
    if(!comparedPass){
        return reply.status(403).send({message: "passwords didn't match"})
    }
    
    const token = request.server.jwt.sign({user})

    return reply.status(202).send({message: "user logged with sucess", token})
}