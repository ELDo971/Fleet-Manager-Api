import express from 'express'
import { getUsers, getUserById, deleteUserById, registerUser, loginUser, patchUser } from '../controllers/users.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN"), getUsers) // Will match GET /users
router.get('/:id', authMiddleware, authorize("ADMIN"), getUserById) // Will match GET /users/:id
router.delete('/:id', authMiddleware, authorize("ADMIN"), deleteUserById) // Will match DELETE /users/:id
router.post('/register', authMiddleware, authorize("ADMIN"), registerUser) // Will match POST /users/register
router.post('/login', loginUser) // Will match POST /users/login
router.patch('/:id', authMiddleware, authorize("ADMIN"), patchUser) // Will match PATCH /users/:id

// Export the router to be used on the app
export default router