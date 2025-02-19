import express from 'express'
import { getFlight, getFlightById, deleteflightById, patchFlight, addFlightSchedule, getFlightLocation } from '../controllers/flight.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER","USER"), getFlight) // Will match GET /flights
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getFlightById) // Will match GET /flights/:id
router.delete('/:id', authMiddleware, authorize("ADMIN"), deleteflightById) // Will match DELETE /flights/:id
router.post('/add', authMiddleware, authorize("ADMIN","MANAGER"), addFlightSchedule) // Will match POST /flights/add
router.patch('/:id', authMiddleware, authorize("ADMIN","MANAGER"), patchFlight) // Will match PATCH /flights/:id
router.get('/location/:id', authMiddleware, authorize("ADMIN","MANAGER"), getFlightLocation)
// Export the router to be used on the app
export default router