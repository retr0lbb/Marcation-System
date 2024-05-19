import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../utils/prisma";


export async function createMarcationHandler(request: FastifyRequest, reply: FastifyReply){
    const bodyParams = z.object({
        clientName: z.string(),
        marcationStartDate: z.string().datetime({
            message: "invalid datetime format"
        }),
        marcationEndDate: z.string().datetime({
            message: "invalid datetime format"
        })
    })
    const {marcationStartDate, marcationEndDate, clientName} = bodyParams.parse(request.body)
    
    const startDate = new Date(marcationStartDate)
    const endDate = new Date(marcationEndDate)

    const minGap = 30 * 60 * 1000;  //30 minutes in miliseconds
    const maxDuration = 3 * 60 * 60 *1000  // 3 hours in miliseconds


    if(startDate.getTime() - endDate.getTime() > maxDuration){
        return reply.status(400).send({message: "Max duration time is 3 hours"})
    }
    if(startDate.getTime() < Date.now() || endDate.getTime() < Date.now()){
        console.log(Date.now(), " ", startDate.getTime())
        return reply.status(400).send({message: "Cannot mark a date in the past"})
    }

    const hasAnyMarcationOnThisDate = await prisma.marcation.findFirst({
        where: {
            OR: [
                {
                    AND: [
                        {marcationStartDate: {lte: marcationEndDate}},
                        {marcationEndDate: {gte: marcationStartDate}}
                    ]
                },
                {
                    AND: [
                        { marcationEndDate: { lte: new Date(startDate.getTime() + minGap).toISOString() } },
                        { marcationEndDate: { gte: new Date(startDate.getTime() - minGap).toISOString() } }
                    ]
                }
            ]
           
        }
    })
    
    if(hasAnyMarcationOnThisDate){
        console.log(hasAnyMarcationOnThisDate)
        return reply.status(400).send({message: "Time conflict, Plese check the avaiables Times"})
    }

     const result = await prisma.marcation.create({
        data: {
            clientName,
            marcationEndDate: endDate.toISOString(),
            marcationStartDate: startDate.toISOString()
        }
    })


    return reply.status(200).send({message: "Marcation created with sucess", marcation: result})
}

export async function createMarcation(app: FastifyInstance){
    app.post("/", createMarcationHandler )
}