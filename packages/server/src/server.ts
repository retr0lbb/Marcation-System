import fastify from "fastify"
import { getApointment } from "./routes/get-apponiments"
import { createApointment } from "./routes/create-appoinment"
import { CreateCostumer } from "./routes/create-patient"
import createRole from "./routes/create-role"
import createMedic from "./routes/create-medic"
import createUser from "./routes/create-user"
const port = 3333
const app = fastify()



app.register(getApointment)
app.register(createApointment)
app.register(CreateCostumer)
app.register(createMedic)
app.register(createUser)
app.register(createRole)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

