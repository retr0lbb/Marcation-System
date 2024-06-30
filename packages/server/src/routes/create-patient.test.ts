jest.mock("../utils/prisma", ()=> ({
    prisma: {
        patient: {
            findFirst: jest.fn(),
            create: jest.fn()
        }
    }
}));

import { CreateCostumerHandler } from "./create-patient";
import { prisma } from "../utils/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

describe("teste create patient", () => {

    let request: FastifyRequest;
    let reply: FastifyReply;

    beforeAll(() => {
        request = {} as unknown as FastifyRequest;
        reply = {} as unknown as FastifyReply;
    })

    it("Should return error if other user already have this email", async() => {
        
        request.body = {contatcPhone: "123456789", email: "a@gmail.com", name: "jhon doe"}
        reply.status = jest.fn().mockReturnThis();
        reply.send = jest.fn()


        const mockFindFirs = prisma.patient.findFirst as jest.Mock

        mockFindFirs.mockRejectedValue([{ 
            contatcPhone: "00000000", email: "a@gmail.com", name: "ungle grandpa"
        }])

        await CreateCostumerHandler(request, reply)
        expect(reply.status).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: "Sorry other patient already used this email"})
    })
})