jest.mock("../utils/prisma", ()=> ({
  prisma: {
    appointment: {
      findMany: jest.fn()
    }
  }
}))
import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../utils/prisma"
import { getApointmentHandler } from "./get-apponiments"
//100% test coverange


describe("Test get appointment", ()=> {
  let request: FastifyRequest
  let reply: FastifyReply

  beforeEach(()=> {
    request = {} as unknown as FastifyRequest
    reply = {} as unknown as FastifyReply
  })

  it("should return 200 if everything is valid", async()=> {
    request.query = {page: "1", query: ""}
    reply.status = jest.fn().mockReturnThis()
    reply.send = jest.fn()
    const mockFindMany = prisma.appointment.findMany as jest.Mock;

    mockFindMany.mockResolvedValue([
      {
        marcationDate: "2024-11-12T19:00:00.000Z",
        Patient: { name: "Mock", contatcPhone: "Mock" },
        Medic: { name: "Mock", especialization: "Mock", MedicRoles: { name: "Mock" } }
      }
    ])

    await getApointmentHandler(request, reply)
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      results: [
        {
          patient_name: "Mock",
          contact_phone: "Mock",
          medic_name: "Mock",
          type_of_apointment: "Mock",
          medic_especialization: "Mock",
          appointment_date: "2024-11-12T19:00:00.000Z"
        }
      ]
    });
  });


  it("should return 404 when it dont find appointments", async()=> {
    request.query = {page: "1", query: ""}
    reply.status = jest.fn().mockReturnThis()
    reply.send = jest.fn()
    const mockFindMany = prisma.appointment.findMany as jest.Mock;

    mockFindMany.mockResolvedValue([])

    await getApointmentHandler(request, reply)
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({message: "No Appointments found"})
  });

  it("should return 400 when page isnt a valid int", async()=> {
    request.query = {page: "-1", query: ""}
    reply.status = jest.fn().mockReturnThis()
    reply.send = jest.fn()

    await getApointmentHandler(request, reply)
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({message: "Page number cannot be less than 0"})
  });  
});
