import fastify from "fastify"
import { getMarcations } from "./routes/get-marcations"
import { createMarcation } from "./routes/create-appoinment"
import { CreateCostumer } from "./routes/create-user"
import createMedic from "./routes/create-medic"
import createRole from "./routes/create-medic-role"
const port = 3333
const app = fastify()



app.register(getMarcations)
app.register(createMarcation)
app.register(CreateCostumer)
app.register(createMedic)
app.register(createRole)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

