import express from 'express'
import cors from 'cors'
import routes from './routers/routes.js'
import * as OpenApiValidator from 'express-openapi-validator'
import rateLimit from "express-rate-limit"

// Import path module to get the current directory (node < 20.11.X)
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

import dotenv from 'dotenv';
dotenv.config();

//ratelimite 
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000,          // Limit to 1000 requests per minute per IP or API key
    message: "Too many requests. Please slow down.",
  });

// Initialize express
const app = express()

// Use default middlewares
app.use(cors()) // Cors is a middleware that allows/disallows access to the API
app.use(express.json()) // Parse incoming requests with JSON payloads
app.use(OpenApiValidator.middleware({
    apiSpec: __dirname + './openapi-main.yaml',
    ignoreUndocumented: true
}))
//app.use(limiter)

// API routers
app.use('/users', routes.usersRouter) // When a request is made to /users, the usersRouter will handle it
app.use('/airports', routes.airportRouter) // When a request is made to /airport, the airportRouter will handle it
app.use('/aircraft_models', routes.aircraft_modelRouter)
app.use('/status', routes.statusRouter)
app.use('/maintenance_reports', routes.maintenance_reportRouter)
app.use('/aircrafts', routes.aircraftRouter)
app.use('/crews', routes.crewRouter)
app.use('/flights', routes.flightRouter)
app.use('/crew_assignements', routes.crew_assignementRouter)

app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    })
})

// Export the app to be used in the server
export default app