jest.mock("../utils/prisma", ()=> ({
    prisma: {
        patient: {
            findUnique: jest.fn(),
        },
        medic: {
            findUnique: jest.fn()
        },
        appointment: {
            findMany: jest.fn(),
            create: jest.fn()
        }
    }
}));
import { FastifyReply, FastifyRequest } from "fastify";
import { createApointmentHandler } from "./create-appoinment"
import { prisma } from "../utils/prisma";

describe("CreateAppointments test case", () => {
    
    let request: FastifyRequest
    let reply: FastifyReply

    beforeAll(()=> {
        request = {} as unknown as FastifyRequest
        reply = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as unknown as FastifyReply
    })


    it("should create appointment if everythis is alright", async() => {
        const todaysNow = new Date();
        const startDate  = new Date(todaysNow.getTime() + 1 * 60 * 60 *1000)
        const marcationEndDate = new Date(startDate.getTime() + 2 * 60 * 60 *1000);


        request.body = {
            marcationDate: startDate.toISOString(), 
            expectMarcationEnd: marcationEndDate.toISOString(), 
            medicId: "67ad2fd3-c1f3-4474-8685-1413c419f146", 
            finalRecomendations: ""
        }

        request.params = {
            patientId: "5868d339-8b26-472c-a7b8-ed9748efe40b"
        }

        const findMedicMock = prisma.medic.findUnique as jest.Mock;
        const findPatientMock = prisma.patient.findUnique as jest.Mock;
        const findAppointmentesMock = prisma.appointment.findMany as jest.Mock;
        const createAppointmentMock = prisma.appointment.create as jest.Mock;


        findMedicMock.mockResolvedValue({
            id: "some-valid-id",
            name: "jhoe doe",
            especialization: null,
            medicRolesId: 1
        })

        findPatientMock.mockResolvedValue({
            id: "someValidId",
            name: "Tenz Sacy",
            email: "validEmai@email.com",
            contatcPhone: "1111111111"
        })

        findAppointmentesMock.mockResolvedValue([])

        createAppointmentMock.mockResolvedValue({
            id: "appointment id",
            marcationDate: startDate,
            expectMarcationEnd: marcationEndDate,
            finalRecomendations: null,
            medicId: "some-valid-id",
            patientId: "someValidId"
        })

        await createApointmentHandler(request, reply)

        console.log(reply.send())

        expect(reply.status).toHaveBeenCalledWith(201)
        expect(reply.send).toHaveBeenCalledWith({message: "Marcation created with success", marcation: {
            id: "appointment id",
            marcationDate: startDate,
            expectMarcationEnd: marcationEndDate,
            finalRecomendations: null,
            medicId: "some-valid-id",
            patientId: "someValidId"
        }})
    });

    it("should return 400 if already have a marcation on that date", async() => {
        const todaysNow = new Date();
        const startDate  = new Date(todaysNow.getTime() + 1 * 60 * 60 *1000)
        const marcationEndDate = new Date(startDate.getTime() + 2 * 60 * 60 *1000);


        request.body = {
            marcationDate: startDate.toISOString(), 
            expectMarcationEnd: marcationEndDate.toISOString(), 
            medicId: "67ad2fd3-c1f3-4474-8685-1413c419f146", 
            finalRecomendations: ""
        }

        request.params = {
            patientId: "5868d339-8b26-472c-a7b8-ed9748efe40b"
        }

        const findMedicMock = prisma.medic.findUnique as jest.Mock;
        const findPatientMock = prisma.patient.findUnique as jest.Mock;
        const findAppointmentesMock = prisma.appointment.findMany as jest.Mock;


        findMedicMock.mockResolvedValue({
            id: "some-valid-id",
            name: "jhoe doe",
            especialization: null,
            medicRolesId: 1
        })

        findPatientMock.mockResolvedValue({
            id: "someValidId",
            name: "Tenz Sacy",
            email: "validEmai@email.com",
            contatcPhone: "1111111111"
        })

        findAppointmentesMock.mockResolvedValue([
            {  id: "appointment id",
                marcationDate: startDate,
                expectMarcationEnd: marcationEndDate,
                finalRecomendations: null,
                medicId: "some-valid-id",
                patientId: "someValidId"
            }
        ])

        await createApointmentHandler(request, reply)

        expect(reply.status).toHaveBeenCalledWith(400)
        expect(reply.send).toHaveBeenCalledWith({message: "An other apointment is already on this date"})
    })

    it("should return 404 if not find medic or patient", async () => {
        const {finalDateWith2HourOfDiference, initialDateWith1HourOfdiference} = getValidDateTimes()

        request.body = {
            marcationDate: initialDateWith1HourOfdiference.toISOString(), 
            expectMarcationEnd: finalDateWith2HourOfDiference.toISOString(), 
            medicId: "67ad2fd3-c1f3-4474-8685-1413c419f146", 
            finalRecomendations: ""
        }

        request.params = {
            patientId: "5868d339-8b26-472c-a7b8-ed9748efe40b"
        }

        const findMedicMock = prisma.medic.findUnique as jest.Mock;
        const findPatientMock = prisma.patient.findUnique as jest.Mock;


        findMedicMock.mockResolvedValue(null)
        findPatientMock.mockResolvedValue({
            id: "someValidId",
            name: "Tenz Sacy",
            email: "validEmai@email.com",
            contatcPhone: "1111111111"
        })

        await createApointmentHandler(request, reply)

        expect(reply.status).toHaveBeenCalledWith(404)
        expect(reply.send).toHaveBeenCalledWith({message: "Patient Or medic not found"})
    });

    it("should return 400 if the appointment date is in the past", async() => {
        const {finalDateWith2HourOfDiference, initialDateWith1HourOfdiference} = getValidDateTimes(false);
        request.body = {
            marcationDate: initialDateWith1HourOfdiference.toISOString(), 
            expectMarcationEnd: finalDateWith2HourOfDiference.toISOString(), 
            medicId: "67ad2fd3-c1f3-4474-8685-1413c419f146", 
            finalRecomendations: ""
        }
        request.params = {
            patientId: "5868d339-8b26-472c-a7b8-ed9748efe40b"
        }

        console.log(finalDateWith2HourOfDiference.toISOString());

        await createApointmentHandler(request, reply)
        expect(reply.status(400));
        expect(reply.send).toHaveBeenCalledWith({message: "Cannot mark a date in the past"})
    })
})


function getValidDateTimes(isValid?: boolean): {initialDateWith1HourOfdiference: Date, finalDateWith2HourOfDiference: Date}{

    const hour = 60 * 60 *1000 // 1 hour in miliseconds
    const now = new Date();
    let startDate  = new Date(now.getTime() + 1 * hour);
    let marcationEndDate = new Date(startDate.getTime() + 2 * hour);

    if(isValid !== null && isValid == false){
        startDate = new Date(now.getTime() - 5 * hour)
        marcationEndDate = new Date(startDate.getTime() - 6 * hour);
    }

    return {
        initialDateWith1HourOfdiference: startDate,
        finalDateWith2HourOfDiference: marcationEndDate
    }
}
