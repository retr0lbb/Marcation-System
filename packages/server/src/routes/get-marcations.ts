import { FastifyInstance } from "fastify";

export async function getMarcations(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        return reply.status(200).send({})
    })
}