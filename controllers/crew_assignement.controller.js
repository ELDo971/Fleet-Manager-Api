import { getAll, getById, deleteById, addAssignement, updateById } from '../services/crew_assignement.service.js'

export const getAssignement = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getAssignementById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const assignement = await getById(parseInt(req.params.id))

    // If the Maintenance report is not found, we will return a 404 status code
    if (!assignement) {
        return res.status(404).json({
            success: false,
            message: 'assignement  not found'
        })
    }

    // Otherwise we will return the Maintenance report object
    return res.json({
        success: true,
        data: assignement
    })
}

export const deleteAssignementById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'Assignement not found'
        })
    }

    return res.json({
        success: true,
        message: 'Assignement deleted'
    })
}

export const patchAssignement = async (req, res, next) => {
    const id = parseInt(req.params.id); // Assignement ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedAssignement = await updateById(id, updateData);
        res.json({
            success: true,
            data: updatedAssignement,
        });
    } catch (err) {
        next(err); // Handle errors (Assignement not found, iata/icao already in use, etc.)
    }
};

export const createAssignement = async (req, res, next) => {
    const { flightId,
        crewId,
    } = req.body;
    let assignement;

    try {
        assignement = await addAssignement(flightId,
            crewId,
        );
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created assignement as the response
    res.json({
        success: true,
        data: assignement,
    });
}