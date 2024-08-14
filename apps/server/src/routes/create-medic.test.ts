jest.mock("../utils/prisma", ()=> ({
    prisma: {
        patient: {
            findUnique: jest.fn(),
        },
        medic: {
            findUnique: jest.fn(),
            create: jest.fn()
        },
        appointment: {
            findMany: jest.fn() as jest.Mock,
            create: jest.fn() as jest.Mock
        },
        medicRoles: {
            findUnique: jest.fn()
        }
    }
}));
import {prisma} from "../utils/prisma"
import variables from "../utils/testVariables"
import {createMedicHandler} from "./create-medic"


describe("Cadastrar medic test case", ()=> {
    const {reply, request} = variables;

    beforeEach(()=> {
        request.body = {};
        request.params = {};
        request.query = {};

        reply.status = jest.fn().mockReturnThis()
        reply.send = jest.fn()
    })



    it("should create medic if everything is ok", async() => {
        const data =  {name: "Carlos Infantus", especialization: "Cardiologia infantil", medicRoleId: 1};
        request.body = data;
        
        const prismaMock = prisma.medicRoles.findUnique as jest.Mock;
        const createMedicMock = prisma.medic.create as jest.Mock;

        prismaMock.mockResolvedValue({
            some: "some"
        })

        createMedicMock.mockResolvedValue({
            id: "some-valid-id",
            name: data.name,
            especialization: data.especialization,
            medicRolesId: data.medicRoleId
        })

        await createMedicHandler(request, reply)

        expect(reply.status).toHaveBeenCalledWith(201)
        expect(reply.send).toHaveBeenCalledWith({
            message: `Medic created with sucess`,
            data: {
                id: "some-valid-id",
                name: data.name,
                especialization: data.especialization,
                medicRolesId: data.medicRoleId
            }
        })
    })

    it("Should return 400 if medicRole id is not found", async()=>{
        const data =  {name: "Carlos Infantus", especialization: "Cardiologia infantil", medicRoleId: 69420};
        request.body = data
        const prismaMock = prisma.medicRoles.findUnique as jest.Mock;

        prismaMock.mockReturnValue(null)

        await createMedicHandler(request, reply)

        expect(reply.status).toHaveBeenLastCalledWith(404)
    })
})