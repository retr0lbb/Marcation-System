import { FastifyReply, FastifyRequest } from "fastify"
import { getApointmentHandler } from "./get-apponiments"



describe("test get appointment functions", ()=> {

    let request: FastifyRequest;
    let reply: FastifyReply;

    let prisma = {
        appointment: {
            findMany: jest.fn()
        }
    }

    beforeAll(() => {
        reply = {} as FastifyReply
        request = {} as FastifyRequest
    })

    it("should return 200 if every thing is alryght", async ()=>{
        request.query = { page: '1', query: '' }
        reply.send = jest.fn()
        reply.status = jest.fn().mockReturnThis()

        prisma.appointment.findMany.mockResolvedValue([
            {
                marcationDate: "2024-11-08T18:00:00.000Z",
                Medic: {
                  name: 'Aqui é jest',
                  especialization: 'Aqui é jest',
                  MedicRoles: [Object]
                },
                Patient: { name: 'Cara ou coroa', contatcPhone: 'memememmememme' }
              }
        ])

        
       await getApointmentHandler(request, reply)
       expect(reply.send).toHaveBeenCalledTimes(1)
       expect(reply.status).toHaveBeenCalledWith(200)
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
});