import express from 'express'
import { getAirport, getAirportById, deleteAirportById, addAirport, patchAirport, getAirportWeather } from '../controllers/airport.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER","USER"), getAirport) // Will match GET /airports
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER","USER"), getAirportById) // Will match GET /airports/:id
router.delete('/:id', authMiddleware, authorize("ADMIN"), deleteAirportById) // Will match DELETE /airports/:id
router.post('/add', authMiddleware, authorize("ADMIN"), addAirport) // Will match POST /airports/add
router.patch('/:id', authMiddleware, authorize("ADMIN"), patchAirport) // Will match PATCH /airports/:id
router.get('/weather/:iata', authMiddleware, authorize("ADMIN","MANAGER","USER"), getAirportWeather) // Will match PATCH /airports/weather/:iata

// Export the router to be used on the app*/
export default router