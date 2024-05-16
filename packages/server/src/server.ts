import fastify from "fastify"
const port = 3333
const app = fastify()

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

