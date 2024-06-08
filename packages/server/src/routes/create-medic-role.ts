import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { string, z } from "zod";
import { prisma } from "../utils/prisma";

const createRoleSchemas = {
    body: z.object({
        name: string()
    })
}

export default async function createRole(app: FastifyInstance) {
    app.post("/hospital/roles", createRoleHandler);
}

export async function createRoleHandler(request: FastifyRequest, reply: FastifyReply){
    const { name } = createRoleSchemas.body.parse(request.body);
    const result = await prisma.medicRoles.create({
        data: {
            name
        }
    });

    return reply.status(201).send({message: "created with success", data: result});
}