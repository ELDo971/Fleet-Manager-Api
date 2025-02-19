import { getAll, getById, deleteById, addAircraft, updateById } from '../services/aircraft.service.js'

export const getAircraft = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getAircraftById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const aircraft = await getById(parseInt(req.params.id))

    // If the Maintenance report is not found, we will return a 404 status code
    if (!aircraft) {
        return res.status(404).json({
            success: false,
            message: 'Aircraft report not found'
        })
    }

    // Otherwise we will return the Maintenance report object
    return res.json({
        success: true,
        data: aircraft
    })
}

export const deleteAircraftById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'Aircraft not found'
        })
    }

    return res.json({
        success: true,
        message: 'Aircraft deleted'
    })
}

export const patchAircraft = async (req, res, next) => {
    const id = parseInt(req.params.id); // Aircraft ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedAircraft = await updateById(id, updateData);
        res.json({
            success: true,
            data: updatedAircraft,
        });
    } catch (err) {
        next(err); // Handle errors (Aircraft not found, iata/icao already in use, etc.)
    }
};

export const addPlane = async (req, res, next) => {
    const { tailNumber,
        baseAirportId,
        modelId,
        productionDate,
        acquisitionDate,
        status } = req.body;
    let report;

    try {
        report = await addAircraft(tailNumber,
            baseAirportId,
            modelId,
            productionDate,
            acquisitionDate,
            status);
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
