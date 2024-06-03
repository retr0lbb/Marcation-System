import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const schemas = {
    RequisitionBodySchema : z.object({
        marcationDate: z.string().datetime({message: "Invalid dateTime format"}),
        expectMarcationEnd: z.string().datetime({message: "Invalid dateTime fomat"}),
        medicId: z.string()
    }),

    RequisitionParamsSchema : z.object({
        patientId: z.string().uuid()
    })
}

export async function createMarcation(app: FastifyInstance){
    app.post("/:patientId/marcation",createMarcationHandler)
}

export async function createMarcationHandler(request: FastifyRequest, reply: FastifyReply){
    const { expectMarcationEnd, marcationDate, medicId } = schemas.RequisitionBodySchema.parse(request.body)
    const { patientId } = schemas.RequisitionParamsSchema.parse(request.params)
    const marcationDateTime = new Date(marcationDate)
    const exectedMarcationEndTime = new Date(expectMarcationEnd)
    
    if(marcationDateTime.getTime() < Date.now() || exectedMarcationEndTime.getTime() < Date.now()){
        return reply.status(400).send({message: "Cannot mark a date in the past"})
    }

    const hasAnyMarcationOnThisDate = await prisma.marcation.findMany({
        where: {
            medicId: medicId,
            patientId: patientId,

            OR: [
                {
                    marcationDate: {
                        lte: marcationDateTime
                    },
                    expectMarcationEnd: {
                        gte: marcationDateTime
                    }
                },
                {
                    marcationDate: {
                        lte: exectedMarcationEndTime
                    },
                    expectMarcationEnd: {
                        gte: exectedMarcationEndTime
                    }
                },
                {
                    marcationDate: {
                        gte: marcationDateTime
                    },
                    expectMarcationEnd: {
                        lte: exectedMarcationEndTime
                    }
                }
            ],
        }
    })
    
    if(hasAnyMarcationOnThisDate.length > 0){
        console.log(hasAnyMarcationOnThisDate)
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

    console.log(hasAnyMarcationOnThisDate)

     const result = await prisma.marcation.create({
        data: {
            marcationDate: marcationDateTime.toISOString(),
            expectMarcationEnd: exectedMarcationEndTime.toISOString(),
            patientId: patientId,
            medicId: medicId
        }
    })

    return reply.status(200).send({message: "Marcation created with success", marcation: result})
}

