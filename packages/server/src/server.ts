import fastify from "fastify"
import {getMarcations} from "./routes/get-marcations"
const port = 3333
const app = fastify()



app.register(getMarcations)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

