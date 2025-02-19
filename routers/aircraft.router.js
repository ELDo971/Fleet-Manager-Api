import express from 'express'
import { getAircraft, getAircraftById, deleteAircraftById, patchAircraft,addPlane } from '../controllers/aircraft.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER","USER"), getAircraft) // Will match GET /aircrafts
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getAircraftById) // Will match GET /aircrafts/:id
router.delete('/:id', authMiddleware, authorize("ADMIN"), deleteAircraftById) // Will match DELETE /aircrafts/:id
router.post('/add', authMiddleware, authorize("ADMIN"), addPlane) // Will match POST /aircrafst/register
router.patch('/:id', authMiddleware, authorize("ADMIN"), patchAircraft) // Will match PATCH /aircrafts/:id

// Export the router to be used on the app
export default router