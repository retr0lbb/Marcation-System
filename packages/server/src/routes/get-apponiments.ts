import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../utils/prisma"


export async function getApointment(app: FastifyInstance) {
    app.get("/", getApointmentHandler)
}
async function getApointmentHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        const marcations = await prisma.appointment.findMany()
        return reply.status(200).send({marcations})
        
    } catch (error) {
        throw error
    }
}
