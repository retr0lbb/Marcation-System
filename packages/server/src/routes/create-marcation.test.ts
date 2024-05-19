/**
 * import z from "zod"

const bodyParams = z.object({
    clientName: z.string(),
    marcationDate: z.string().datetime({message: "missing datetime"}),
    marcationDuration: z.string()
})

const data = {
    clientName: "Henrique Barbosa",
    marcationDate: ""
}

 * 
 */

describe("create marcation tests", () => {
    beforeEach(()=> {
        jest.clearAllMocks();
    });

    
})