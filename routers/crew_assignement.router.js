import express from 'express'
import { getAssignement, getAssignementById, deleteAssignementById, patchAssignement, createAssignement } from '../controllers/crew_assignement.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER"), getAssignement) // Will match GET /crew_assignements
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getAssignementById) // Will match GET /crew_assignements/:id
router.delete('/:id', authMiddleware, authorize("ADMIN","MANAGER"), deleteAssignementById) // Will match DELETE /crew_assignements/:id
router.post('/create', authMiddleware, authorize("ADMIN","MANAGER"), createAssignement) // Will match POST /crew_assignements/register
router.patch('/:id', authMiddleware, authorize("ADMIN","MANAGER"), patchAssignement) // Will match PATCH /crew_assignements/:id

// Export the router to be used on the app
export default router