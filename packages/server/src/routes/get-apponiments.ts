import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma"
import { z } from "zod"

const getApointmentSchemas = {
    url: z.object({
        page: z.string().nullable(),
        query: z.string().nullable()
    })
}

export async function getApointment(app: FastifyInstance) {
    app.get("/", getApointmentHandler)
}

export async function getApointmentHandler(request: FastifyRequest, reply: FastifyReply) {
    const {page, query} = getApointmentSchemas.url.parse(request.query)
    const pageNumber = Number(page)

    if(pageNumber <= 0 || Number.isNaN(pageNumber)){
        return reply.status(400).send({message: "Page number cannot be less than 0"})
    }
    
    const numberOfRegistersPerPage = 10
    try {
        const marcations = await prisma.appointment.findMany({
            skip: (pageNumber -1) * numberOfRegistersPerPage,
            take: numberOfRegistersPerPage,
            orderBy: {
                marcationDate: "desc"
            },
            where: {
                Patient: {
                    name: {
                        contains: query ?? ""
                    }
                }
            },
            select: {
                marcationDate: true,
                Medic: {
                    select: {
                        name: true,
                        especialization: true,
                        MedicRoles: true
                    }
                },
                Patient: {
                    select: {
                        name: true,
                        contatcPhone: true
                    }
                }
            }
        })

        const results = marcations.map((item, index) => {
            return{
                patient_name: item.Patient?.name,
                contact_phone: item.Patient?.contatcPhone,
                medic_name: item.Medic?.name,
                type_of_apointment: item.Medic?.MedicRoles?.name,
                medic_especialization: item.Medic?.especialization,
                appointment_date: item.marcationDate
            }
        })

        console.log(JSON.stringify(marcations[1]))
        return reply.status(200).send({results})
        
    } catch (error) {
        throw error
    }
}
