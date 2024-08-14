
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
        reply = { send: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as FastifyReply;
    })

    it("Should return error if other user already have this email", async() => {
        request.body = {contatcPhone: "123456789", email: "a@gmail.com", name: "jhon doe"}
        const mockReturn = prisma.patient.findFirst as jest.Mock;
        mockReturn.mockResolvedValue([
            {contatcPhone: "00000000", email: "a@gmail.com", name: "geraldo maligno memes"}
        ])
        await CreateCostumerHandler(request, reply)
        expect(reply.status).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: "Sorry other patient already used this email"})
    });

    it("Should create patient if everythign is ok", async() => {
        const data = {contatcPhone: "123456789", email: "a@gmail.com", name: "jhon doe"}
        request.body = data
        const mockFindFirst = prisma.patient.findFirst as jest.Mock;
        mockFindFirst.mockResolvedValue(null)
        await CreateCostumerHandler(request, reply)
        expect(reply.status).toHaveBeenCalledWith(201);
    })

    it("Should return error if email isnt valid", async() => {
        const data = {contatcPhone: "123456789", email: "none", name: "jhon doe"}
        request.body = data;
        await CreateCostumerHandler(request, reply)
        expect(reply.status).toHaveBeenCalledWith(500)
        expect(reply.send).toHaveBeenCalledWith({message: "Validation Error"})
    })
})