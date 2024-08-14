import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";


export async function createApointment(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/:patientId/marcation", {
        schema: {
            body: z.object({
                marcationDate: z.string().datetime({ message: "Invalid dateTime format" }),
                finalRecomendations: z.string().nullable(),
                medicId: z.string()
            }),
            params: z.object({
                patientId: z.string().uuid()
            })
        }
    } , async(request, reply) => {
        const { marcationDate, medicId, finalRecomendations } = request.body;
        const { patientId } = request.params;
    
        const marcationDateTime = new Date(marcationDate);
        
        if (marcationDateTime.getTime() < Date.now()) {
            console.log("date in past");
            return reply.status(400).send({ message: "Cannot mark a date in the past" });
        }
    
        const [patient, medic] = await getMedicAndPatientDataAndReturn({ medicId, patientId });
    
        if (!patient || !medic) {
            return reply.status(404).send({ message: "Patient or medic not found" });
        }
    
        const hasAnyMarcationOnThisDate = await findFirstAppointmentAndIfFindsReturnTrue({ marcationDateTime, medicId, patientId });
    
        if (hasAnyMarcationOnThisDate) {
            console.log("appointment");
            return reply.status(400).send({ message: "Another appointment is already on this date" });
        }
    
        const expectMarcationEnd = new Date(marcationDateTime);
        expectMarcationEnd.setHours(expectMarcationEnd.getHours() + 1);
    
        const result = await prisma.$transaction(async (prisma) => {
            const newAppointment = await prisma.appointment.create({
                data: {
                    marcationDate: marcationDateTime.toISOString(),
                    patientId: patientId,
                    medicId: medicId,
                    finalRecomendations: finalRecomendations
                }
            });
    
    
            return newAppointment;
        });
    
        return reply.status(201).send({ message: "Marcation created with success", marcation: result });
    });
}


async function findFirstAppointmentAndIfFindsReturnTrue(
    { medicId, patientId, marcationDateTime }: 
    { medicId: string, patientId: string, marcationDateTime: Date }
): Promise<boolean> {
    const result = await prisma.appointment.findMany({
        where: {
            medicId: medicId,
            patientId: patientId,
            OR: [
                {
                    marcationDate: {
                        lte: marcationDateTime
                    },
                },
                {
                    marcationDate: {
                        gte: marcationDateTime
                    }
                }
            ],
        }
    });

    return result.length > 0;
}

async function getMedicAndPatientDataAndReturn({ medicId, patientId }: { patientId: string, medicId: string }) {
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
    ]);

    return [patient, medic];
}

