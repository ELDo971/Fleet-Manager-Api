import { getAll, getById, deleteById, createMaintenanceReport, updateById , getRecurringMaintenanceIssues } from '../services/maintenance_report.service.js'

export const getReport = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getReportById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const maintenanceReport = await getById(parseInt(req.params.id))

    // If the Maintenance report is not found, we will return a 404 status code
    if (!maintenanceReport) {
        return res.status(404).json({
            success: false,
            message: 'Maintenance report not found'
        })
    }

    // Otherwise we will return the Maintenance report object
    return res.json({
        success: true,
        data: maintenanceReport
    })
}

export const deleteReportById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'Report not found'
        })
    }

    return res.json({
        success: true,
        message: 'Report deleted'
    })
}

export const createReport = async (req, res, next) => {
    const { aircraftId,
        maintenanceType,
        status,
        description,
        resolvedAt } = req.body;
    let report;

    try {
        report = await createMaintenanceReport(aircraftId,
            maintenanceType,
            status,
            description,
            resolvedAt);
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created report as the response
    res.json({
        success: true,
        data: report,
    });
}

export const patchReport = async (req, res, next) => {
    const id = parseInt(req.params.id); // Airport ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedReport = await updateById(id, updateData);
        res.json({
            success: true,
            data: updatedReport,
        });
    } catch (err) {
        next(err); // Handle errors (airport not found, iata/icao already in use, etc.)
    }
};

export const getRecurringIssuesByModel = async (req, res, next) => {
    try {
        const recurringIssues = await getRecurringMaintenanceIssues();
        res.json({
            success: true,
            data: recurringIssues,
        });
    } catch (err) {
        next(err); // Pass errors to the error handler
    }
};