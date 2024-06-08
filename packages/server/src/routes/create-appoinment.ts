import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { promise, z } from "zod";
import { prisma } from "../utils/prisma";
import { promiseHooks } from "v8";

export const schemas = {
    RequisitionBodySchema : z.object({
        marcationDate: z.string().datetime({message: "Invalid dateTime format"}),
        expectMarcationEnd: z.string().datetime({message: "Invalid dateTime fomat"}),
        medicId: z.string(),
        finalRecomendations: z.string().nullable()
    }),

    RequisitionParamsSchema : z.object({
        patientId: z.string().uuid()
    })
}

export async function createApointment(app: FastifyInstance){
    app.post("/:patientId/marcation",createApointmentHandler)
}

export async function createApointmentHandler(request: FastifyRequest, reply: FastifyReply){

    const { expectMarcationEnd, marcationDate, medicId } = schemas.RequisitionBodySchema.parse(request.body)
    const { patientId } = schemas.RequisitionParamsSchema.parse(request.params)

    const marcationDateTime = new Date(marcationDate)
    const exectedMarcationEndTime = new Date(expectMarcationEnd)
    
    if(marcationDateTime.getTime() < Date.now() || exectedMarcationEndTime.getTime() < Date.now()){
        return reply.status(400).send({message: "Cannot mark a date in the past"})
    }

    const hasAnyMarcationOnThisDate = await prisma.appointment.findMany({
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

 const [patient, medic] = await Promise.all([
        prisma.patient.findUniqueOrThrow({
            where: {
                id: patientId
            }
        }),
        
        prisma.medic.findUnique({
            where: {
                id: medicId
            }
        })
    ])

    if (!patient || !medic){
        return reply.status(404).send({message: "Patient Or medic not found"})
    }

     const result = await prisma.appointment.create({
        data: {
            marcationDate: marcationDateTime.toISOString(),
            expectMarcationEnd: exectedMarcationEndTime.toISOString(),
            patientId: patientId,
            medicId: medicId
        }
    })

    return reply.status(200).send({message: "Marcation created with success", marcation: result})
}

