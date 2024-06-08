import fastify from "fastify"
import { getApointment } from "./routes/get-apponiments"
import { createApointment } from "./routes/create-appoinment"
import { CreateCostumer } from "./routes/create-patient"
import createMedic from "./routes/create-medic"
import createRole from "./routes/create-medic-role"
const port = 3333
const app = fastify()



app.register(getApointment)
app.register(createApointment)
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

