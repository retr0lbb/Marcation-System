import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";

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
        console.log("date in past")
        return reply.status(400).send({message: "Cannot mark a date in the past"})
    }

    const [patient, medic] = await getMedicAndPatientDataAndReturn({medicId, patientId})

    if (!patient || !medic){
        return reply.status(404).send({message: "Patient Or medic not found"})
    }

    const hasAnyMarcationOnThisDate = await findFirstAppointmentAndIfFindsReturnTrue({exectedMarcationEndTime, marcationDateTime, medicId, patientId})

    if(hasAnyMarcationOnThisDate){
        console.log("appointment")
        return reply.status(400).send({message: "An other apointment is already on this date"})
    }

     const result = await prisma.appointment.create({
        data: {
            marcationDate: marcationDateTime.toISOString(),
            expectMarcationEnd: exectedMarcationEndTime.toISOString(),
            patientId: patientId,
            medicId: medicId
        }
    })

    return reply.status(201).send({message: "Marcation created with success", marcation: result})
}



async function findFirstAppointmentAndIfFindsReturnTrue(
    {medicId, patientId, marcationDateTime, exectedMarcationEndTime}: 
    {medicId: string,patientId: string, marcationDateTime: Date, exectedMarcationEndTime: Date }
    ): Promise<boolean>{

    const result = await prisma.appointment.findMany({
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

    if(result.length <= 0){
        return false
    }else{
        return true
    }
}

async function getMedicAndPatientDataAndReturn({medicId, patientId}: {patientId: string, medicId:string }){
    const [patient, medic] = await Promise.all([
        prisma.patient.findUnique({
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
    
    return [patient, medic]
}

