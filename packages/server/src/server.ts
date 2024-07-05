import fastify from "fastify"
import { getApointment } from "./routes/get-apponiments"
import { createApointment } from "./routes/create-appoinment"
import createCostumer from "./routes/create-patient"
import createRole from "./routes/create-role"
import createMedic from "./routes/create-medic"
import createUser from "./routes/create-user"
import createMedicEspecialization from "./routes/create-medic-especialization"
const port = 3333
const app = fastify()



app.register(getApointment)
app.register(createApointment)
app.register(createCostumer)
app.register(createMedic)
app.register(createUser)
app.register(createRole)
app.register(createMedicEspecialization)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

