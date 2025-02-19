import express from 'express'
import { getReport, getReportById, deleteReportById, createReport, patchReport, getRecurringIssuesByModel } from '../controllers/maintenance_report.controller.js'
import authMiddleware from '../middlewares/auth.js'
import { authorize } from "../middlewares/rbacMiddleware.js";

// Create a new router
const router = express.Router()

// Define the routes and the functions that will be executed when those routes are requested
// The functions are imported from the controller(s)
router.get('/', authMiddleware, authorize("ADMIN","MANAGER"), getReport) // Will match GET /users
router.get('/:id', authMiddleware, authorize("ADMIN","MANAGER"), getReportById) // Will match GET /users/:id
router.delete('/:id', authMiddleware, authorize("ADMIN","MANAGER"), deleteReportById) // Will match DELETE /users/:id
router.post('/create', authMiddleware, authorize("ADMIN","MANAGER"), createReport) // Will match POST /users/register
router.patch('/:id', authMiddleware, authorize("ADMIN","MANAGER"), patchReport) // Will match PATCH /users/:id
router.get('/recurring-issues', authMiddleware, authorize("ADMIN","MANAGER"), getRecurringIssuesByModel)

// Export the router to be used on the app
export default router