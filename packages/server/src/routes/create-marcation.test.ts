import { createMarcationHandler, schemas } from "./create-appoinment";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

jest.mock("../utils/prisma")

type RequisitionBody = z.infer<typeof schemas.RequisitionBodySchema>;
type RequisitionParams = z.infer<typeof schemas.RequisitionParamsSchema>;

let request: Partial<FastifyRequest<{
  Body: RequisitionBody;
  Params: RequisitionParams
}>>;
let reply: Partial<FastifyReply>;


describe("create marcation tests", () => {

  beforeEach(() => {
    request = {
      body: {
        marcationDate: new Date(Date.now() + 3600000).toISOString(),
        expectMarcationEnd: new Date(Date.now() + 7200000).toISOString(),
        medicId: "0608ff42-2bda-42be-b8ad-b87e74890bdb"
      },
      params: {
        patientId: "b7aa0505-1b9a-4e76-aff6-3619005f3fb6"
      }
    };

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })


  it("should return 400 if marcationDate or expectMarcationEnd is in the past", async() => {
    if(!request.body?.marcationDate){
      return
    }
    request.body.marcationDate = new Date(Date.now() - 3600000).toISOString();
    await createMarcationHandler(request as FastifyRequest, reply as FastifyReply)
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({message: "Cannot mark a date in the past"})
  })
})