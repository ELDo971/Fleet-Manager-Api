import express from 'express'
import { getAircraftModel, getAircraftModelById, deleteAircraftModelById, addAircraftModel, patchAircraftModel } from '../controllers/aircraft_model.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER"), getAircraftModel) // Will match GET /aircraft_models 
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getAircraftModelById) // Will match GET /aircraft_models/:id
router.delete('/:id', authMiddleware, authorize("ADMIN"), deleteAircraftModelById) // Will match DELETE /aircraft_models/:id
router.post('/add', authMiddleware, authorize("ADMIN"), addAircraftModel) // Will match POST /aircraft_models/add
router.patch('/:id', authMiddleware, authorize("ADMIN"), patchAircraftModel) // Will match PATCH /aircraft_models/:id

// Export the router to be used on the app*/
export default router