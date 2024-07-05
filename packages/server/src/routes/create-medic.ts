import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import { number, string, z } from "zod";

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

    //algoritimo para achar todas as especializações

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(user == null){
        return reply.status(404).send({message: "User not found"})
    }

    const especialities = await prisma.especiality.findMany({
        where: {
            id: {
                in: medicEspecializationId ?? []
            }
        }
    })

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