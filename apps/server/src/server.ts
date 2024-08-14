import fastify from "fastify"
import { getApointment } from "./routes/get-apponiments"
import { createApointment } from "./routes/create-appoinment"
import createCostumer from "./routes/create-patient"
import createRole from "./routes/create-role"
import createMedic from "./routes/create-medic"
import createUser from "./routes/create-user"
import createMedicEspecialization from "./routes/create-medic-especialization"
import logUserByEmail from "./routes/login-user"
import fastifyWebToken from "@fastify/jwt"
import { 
    serializerCompiler, 
    validatorCompiler,
    jsonSchemaTransform,
    createJsonSchemaTransform,
    ZodTypeProvider
} from "fastify-type-provider-zod"
import {fastifySwagger} from "@fastify/swagger"
import {fastifySwaggerUi} from "@fastify/swagger-ui"

const port = 3333
const app = fastify()


app.register(fastifyWebToken, {
    secret: "My super secrete"
})
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
    openapi:{
        info:{
            title: "Marcation",
            description: "A simple solution for marking appointment",
            version: "1.0.0"
        },
        servers: [],
    },
    transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
})
  
app.register(getApointment)
app.register(createApointment)
app.register(createCostumer)
app.register(createMedic)
app.register(createUser)
app.register(createRole)
app.register(createMedicEspecialization)
app.register(logUserByEmail)

app.listen({
    port: port,
}).then(() => {
    console.log("Server running 😑")
}).catch((err) => {
    throw err
})

