import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";



export const schemas = {
    RequisitionBodySchema : z.object({
        marcationDate: z.string().datetime({message: "Invalid dateTime format"}),
        expectMarcationEnd: z.string().datetime({message: "Invalid dateTime fomat"}),
    }),

    RequisitionParamsSchema : z.object({
        patientId: z.string().uuid()
    })
}


export async function createMarcationHandler(request: FastifyRequest, reply: FastifyReply){

    const { expectMarcationEnd, marcationDate } = schemas.RequisitionBodySchema.parse(request.body)
    const { patientId } = schemas.RequisitionParamsSchema.parse(request.params)
    const marcationDateTime = new Date(marcationDate)
    const exectedMarcationEndTime = new Date(expectMarcationEnd)
    const minGap = 30 * 60 * 1000;  //30 minutes in miliseconds


    if(marcationDateTime.getTime() < Date.now() || exectedMarcationEndTime.getTime() < Date.now()){
        return reply.status(400).send({message: "Cannot mark a date in the past"})
    }

    const hasAnyMarcationOnThisDate = await prisma.marcation.findFirst({
        where: {
            OR: [
                {
                    AND: [
                        {marcationDate: {lte: exectedMarcationEndTime}},
                        {expectMarcationEnd: {gte: exectedMarcationEndTime}}
                    ]
                },
                {
                    AND: [
                        { marcationDate: { lte: new Date(marcationDateTime.getTime() + minGap).toISOString() } },
                        { expectMarcationEnd: { gte: new Date(marcationDateTime.getTime() - minGap).toISOString() } }
                    ]
                }
            ]
           
        }
    })
    
    if(hasAnyMarcationOnThisDate){
        return reply.status(400).send({message: "Time conflict, Plese check the avaiables Times"})
    }

    const customer = await prisma.patient.findUniqueOrThrow({
        where: {
            id: patientId
        }
    })

    if (!customer){
        return reply.status(404).send({message: "Customer not found"})
    }

     const result = await prisma.marcation.create({
        data: {
            marcationDate: marcationDateTime.toISOString(),
            expectMarcationEnd: exectedMarcationEndTime,
            patientId: patientId
        }
    })

    return reply.status(200).send({message: "Marcation created with success", marcation: result})
}

export async function createMarcation(app: FastifyInstance){
    app.post("/:patientId/marcation",createMarcationHandler)
}