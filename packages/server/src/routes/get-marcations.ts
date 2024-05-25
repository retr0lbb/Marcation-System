import { FastifyInstance } from "fastify";
import {prisma} from "../utils/prisma"

export async function getMarcations(app: FastifyInstance) {
    app.get("/", async ( _, reply ) => {
        try {
            const marcations = await prisma.marcation.findMany()
            return reply.status(200).send({marcations})
            
        } catch (error) {
            throw error
        }
    })
}