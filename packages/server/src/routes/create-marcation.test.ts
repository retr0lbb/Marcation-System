import fastify, { FastifyInstance } from "fastify";
import { createMarcation } from "./create-marcation";
import { prisma } from "../utils/prisma";

jest.mock("../utils/prisma", () => ({
    prisma: {
      marcation: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    },
  }));

describe("create marcation tests", () => {
    let app: FastifyInstance;

    beforeAll(() => {
        app = fastify()
        createMarcation(app)
    })

    beforeEach(()=> {
        jest.clearAllMocks();
    });


    it("should create a marcation", async () => {
        prisma.marcation.findFirst = jest.fn().mockResolvedValue(null)
        prisma.marcation.create = jest.fn().mockResolvedValue({
            clientName: "Henrique Barbosa Sampaio",
            marcationStartDate: "2024-05-20T22:30:00Z",
            marcationEndDate: "2024-05-20T23:00:00Z",
            id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d"
        })

        const response = await app.inject({
            method: "POST",
            url: "/",
            payload: {
                clientName: "Henrique Barbosa Sampaio",
                marcationStartDate: "2024-05-20T22:30:00Z",
                marcationEndDate: "2024-05-20T23:00:00Z",
            }
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toEqual({
            message: "Marcation created with sucess",
            marcation: {
                id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d",
                clientName: "Henrique Barbosa Sampaio",
                marcationStartDate: "2024-05-20T22:30:00Z",
                marcationEndDate: "2024-05-20T23:00:00Z"
            }
        })
        expect(prisma.marcation.create).toHaveBeenCalledWith({
            data: {
                clientName: "Henrique Barbosa Sampaio",
                marcationEndDate: "2024-05-20T23:00:00.000Z",
                marcationStartDate: "2024-05-20T22:30:00.000Z"
            }
        })
    })
})