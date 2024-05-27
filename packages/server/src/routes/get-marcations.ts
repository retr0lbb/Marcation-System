import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../utils/prisma"


async function getMarcationHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        const marcations = await prisma.marcation.findMany()
        return reply.status(200).send({marcations})
        
    } catch (error) {
        throw error
    }
}
export async function getMarcations(app: FastifyInstance) {
    app.get("/", getMarcationHandler)
}