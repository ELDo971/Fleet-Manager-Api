import express from 'express'

import { getCrew, getCrewById, deleteCrewById, patchCrew, addCrewMember,getCrewStats } from '../controllers/crew.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER"), getCrew) // Will match GET /crews
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getCrewById) // Will match GET /crews/:id
router.delete('/:id', authMiddleware, authorize("ADMIN","MANAGER"), deleteCrewById) // Will match DELETE /crews/:id
router.post('/add', authMiddleware, authorize("ADMIN","MANAGER"), addCrewMember) // Will match POST /crews/add
router.patch('/:id', authMiddleware, authorize("ADMIN","MANAGER"), patchCrew) // Will match PATCH /crews/:id
router.get('/stats/:id', authMiddleware, authorize("ADMIN","MANAGER"),getCrewStats ) // Will match GET /crews/stats/:id

// Export the router to be used on the app
export default router