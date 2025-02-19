import { getAll, getById, deleteById, createAircraftModel, updateAircraftModel } from '../services/aircraft_model.service.js'

export const getAircraftModel = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}


export const getAircraftModelById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const aircraftModel = await getById(parseInt(req.params.id))

    // If the aircraft model is not found, we will return a 404 status code
    if (!aircraftModel) {
        return res.status(404).json({
            success: false,
            message: 'aircraft model not found'
        })
    }

    // Otherwise we will return the aircraft model object
    return res.json({
        success: true,
        data: aircraftModel
    })
}

export const deleteAircraftModelById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'aircraft model not found'
        })
    }

    return res.json({
        success: true,
        message: 'aircraft model deleted'
    })
}



export const addAircraftModel = async (req, res, next) => {
    // We get fullName, email, password, role, and status from the request body
    const {
        manufacturer,
        name,
        crewCapacity,
        passengerCapacity,
        cargoCapacity,
        height,
        length,
        maxRange,
        speed,
        fuelCapacity,
        fuelBurn } = req.body;
    let aircraftModel;

    try {
        // Call the create service with the full name, email, password, and optional role/status
        aircraftModel = await createAircraftModel(
            manufacturer,
            name,
            crewCapacity,
            passengerCapacity,
            cargoCapacity,
            height,
            length,
            maxRange,
            speed,
            fuelCapacity,
            fuelBurn);
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created aircraft model as the response
    res.json({
        success: true,
        data: aircraftModel,
    });
}

export const patchAircraftModel = async (req, res, next) => {
    const id = parseInt(req.params.id); // Airport ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedAircraftModel = await updateAircraftModel(id, updateData);
        res.json({
            success: true,
            data: updatedAircraftModel,
        });
    } catch (err) {
        next(err); // Handle errors (airport not found, iata/icao already in use, etc.)
    }
};