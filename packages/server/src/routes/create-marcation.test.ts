import { FastifyInstance } from "fastify";
import { createMarcation } from "./create-marcation";



const mockApp = {
    post: jest.fn()
} as unknown as FastifyInstance

describe("create marcation tests", () => {
    beforeEach(()=> {
        jest.clearAllMocks();
    });


    it("should create a marcation", async() => {
        const mockRequest = {
            body: {
                marcationDate: "2024-05-18",
                marcationDuration: "2 hours",
                clientName: "John Doe"
            }
        };
        
    })
})