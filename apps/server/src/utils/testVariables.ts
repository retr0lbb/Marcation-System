import { FastifyReply, FastifyRequest } from "fastify";

function main(){
    const reply = {} as FastifyReply
    const request = {} as FastifyRequest

    return {
        reply,
        request
    }
}

export default main()