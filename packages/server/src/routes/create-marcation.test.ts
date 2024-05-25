import { createMarcationHandler } from "./create-marcation";
import { prisma } from "../utils/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

jest.mock("../utils/prisma", () => ({
    prisma: {
      marcation: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    },
  }));

describe("create marcation tests", () => {
    beforeEach(()=> {
        jest.clearAllMocks();
    });


    it("should create a marcation", async () => {

        prisma.marcation.findFirst = jest.fn().mockResolvedValue(null);
        prisma.marcation.create = jest.fn().mockResolvedValue({
            id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d",
            clientName: "Henrique Barbosa Sampaio",
            marcationStartDate: "2024-05-20T22:30:00.000Z",
            marcationEndDate: "2024-05-20T23:00:00.000Z",
        });

        const http = {
            request: {
              body: {
                clientName: "Henrique Barbosa Sampaio",
                marcationStartDate: "2024-06-20T22:30:00.000Z",
                marcationEndDate: "2024-06-20T23:00:00.000Z",
              }
            } as unknown as FastifyRequest,
            reply: {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            } as unknown as FastifyReply,
          };

        await createMarcationHandler(http.request, http.reply)

        expect(http.reply.status).toHaveBeenCalledWith(200)
        expect(http.reply.send).toHaveBeenCalledWith({
            message: "Marcation created with success",
            marcation: {
              id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d",
              clientName: "Henrique Barbosa Sampaio",
              marcationStartDate: "2024-05-20T22:30:00.000Z",
              marcationEndDate: "2024-05-20T23:00:00.000Z",
            },
        });
    })
    it("should return time conflict", async() => {

        prisma.marcation.findFirst = jest.fn().mockResolvedValue({
            id: "5ec4424d-d4ff-43c0-8e1e-58a918998b1d",
            clientName: "Henrique Barbosa Sampaio",
            marcationStartDate: "2024-06-20T22:30:00.000Z",
            marcationEndDate: "2024-06-20T23:00:00.000Z",
        });
        prisma.marcation.create = jest.fn().mockResolvedValue(null);

        const http = {
            request: {
              body: {
                clientName: "Henrique Barbosa Sampaio",
                marcationStartDate: "2024-06-20T21:30:00.000Z",
                marcationEndDate: "2024-06-20T22:00:00.000Z",
              }
            } as unknown as FastifyRequest,
            reply: {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            } as unknown as FastifyReply,
        };

        await createMarcationHandler(http.request, http.reply)
        expect(http.reply.send).toHaveBeenCalled()
        expect(http.reply.status).toHaveBeenCalledWith(400)
        expect(http.reply.send).toHaveBeenCalledWith({
            message: "Time conflict, Plese check the avaiables Times"
        })
    })
})