import fastify from "fastify"
import {getMarcations} from "./routes/get-marcations"
import { createMarcation } from "./routes/create-marcation"
import { CreateCostumer } from "./routes/create-user"
const port = 3333
const app = fastify()



app.register(getMarcations)
app.register(createMarcation)
app.register(CreateCostumer)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

