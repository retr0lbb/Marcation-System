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
        const basePayload = {
            clientName: "Henrique Barbosa Sampaio",
            marcationStartDate: "2024-05-20T22:30:00.000Z",
            marcationEndDate: "2024-05-20T23:00:00.000Z"
        }

        prisma.marcation.findFirst = jest.fn().mockResolvedValue(null)
        prisma.marcation.create = jest.fn().mockResolvedValue({
            ...basePayload,
            id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d"
        })

        const response = await app.inject({
            method: "POST",
            url: "/",
            payload: {
               ...basePayload
            }
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toEqual({
            message: "Marcation created with sucess",
            marcation: {
                id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d",
                ...basePayload
            }
        })
        expect(prisma.marcation.create).toHaveBeenCalledWith({
            data: {
                ...basePayload
            }
        })
    })
})