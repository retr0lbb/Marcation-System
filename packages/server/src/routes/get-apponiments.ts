import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../utils/prisma"
import {z} from "zod"


const getApointmentSchemas = {
    url: z.object({
        page: z.string().nullable(),
        query: z.string().nullable()
    })
}
export async function getApointment(app: FastifyInstance) {
    app.get("/", getApointmentHandler)
}
async function getApointmentHandler(request: FastifyRequest, reply: FastifyReply) {
    const {page, query} = getApointmentSchemas.url.parse(request.query)
    const numberOfRegistersPerPage = 10
    try {
        
        const marcations = await prisma.appointment.findMany({
            skip: page? (Number(page) -1) * numberOfRegistersPerPage: 1,
            take: numberOfRegistersPerPage,
            where: {
                Patient: {
                    name: {
                        contains: query ?? ""
                    }
                }
            }
        })

        console.log(marcations.length)
        return reply.status(200).send({marcations})
        
    } catch (error) {
        throw error
    }
}
