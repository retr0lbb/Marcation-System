import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { hashPassword } from "../utils/encrypt-pass";

export default async function createUser(app: FastifyInstance) {
    app.post("/user", createUserHandler)
}

export async function createUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        contactPhone: z.string(),
        password: z.string(),
        roleId: z.number().int().positive()
    })
    const {contactPhone, email, name, password, roleId} = bodySchema.parse(request.body)

    const verifyEmailRegistered = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            email: true
        }
    })
    if(verifyEmailRegistered !== null){
        return reply.status(400).send({message: "this email is already registered make the login"})
    }

    const verifyIfRoleIdExists = await prisma.role.findUnique({
        where: {
            id: roleId
        }
    })

    if(verifyIfRoleIdExists == null){
        return reply.status(404).send({message: "Role not found"})
    }

    const hashedPass = await hashPassword(password)

    const results = await prisma.user.create({
        data: {
            contactPhone,
            email,
            name,
            password: hashedPass,
            roleId
        }
    })

    return reply.status(201).send({message: "User created with sucess", data: results})
}
