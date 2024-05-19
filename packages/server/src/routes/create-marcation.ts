import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";



export async function createMarcation(app: FastifyInstance){
    app.post("/", async (request, response)=> {
        const bodyParams = z.object({
            clientName: z.string(),
            marcationDate: z.string(),
            marcationDuration: z.string()
        })
        const {marcationDate, marcationDuration, clientName} = bodyParams.parse(request.body)


        const result = await prisma.marcation.create({
            data: {
                clientName,
                MarcationDate: marcationDate,
                MarcationDuration: marcationDuration
            }
        })
    })
}