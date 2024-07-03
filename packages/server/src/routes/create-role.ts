import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export default async function createRole(app: FastifyInstance){
    app.post("/roles", createRoleHandler)
}

export async function createRoleHandler(request: FastifyRequest, reply: FastifyReply){
    const createRoleSchema = z.object({
        name: z.string()
    })

    const {name} = createRoleSchema.parse(request.body)

    const verifyIfNameAlreadyExists = await prisma.role.findUnique({
        where: {
            name
        }
    })

    if(verifyIfNameAlreadyExists !== null){
        return reply.status(400).send({message: "this role already exists"})
    }

    const result = await prisma.role.create({
        data: {
            name
        }
    })

    return reply.status(201).send({message: "role created", data: result})
}