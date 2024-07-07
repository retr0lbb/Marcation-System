import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import { z } from "zod";

export default async function createMedic(app: FastifyInstance){
    app.post("/admin/medic", createMedicHandler)
}


export async function createMedicHandler(request: FastifyRequest, reply: FastifyReply){
   const createMedicSchema = z.object({
        userId: z.string(),
        biography: z.string().nullable(),
        CRM: z.string(),
        medicEspecializationId: z.number().array().nullable()
    })

    const { CRM, biography, userId, medicEspecializationId } = createMedicSchema.parse(request.body)

    const findIfMedicAlreadyExists = await prisma.medic.findUnique({
        where: {
            userId: userId
        }
    })

    if(findIfMedicAlreadyExists !== null){
        return reply.status(404).send({message: "This medic is already registered"})
    }

    const [user, especialities] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: userId
            }
        }),
        prisma.especiality.findMany({
            where: {
                id: {
                    in: medicEspecializationId ?? []
                }
            }
        })
    ])

    if(user == null){
        return reply.status(404).send({message: "user not found"})
    }
    if(medicEspecializationId && especialities.length !== medicEspecializationId.length){
        return reply.status(400).send({ error: "Some specialities were not found" });
    }

    const medic = await prisma.medic.create({
        data: {
            CRM,
            id: user.id,
            biography: biography ?? "",
            userId: user.id,
            MedicEspeciality: {
                create: especialities.map(especiality => ({
                    especialityId: especiality.id
                }))
            }
        }
    })

    return reply.status(201).send({message: "Medic inserted with sucess", data: medic})
}