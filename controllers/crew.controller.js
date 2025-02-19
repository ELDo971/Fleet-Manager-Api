import { getAll, getById, deleteById, addCrew, updateById, getCrewFlightStats } from '../services/crew.service.js'

export const getCrew = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getCrewById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const crew = await getById(parseInt(req.params.id))

    // If the crew is not found, we will return a 404 status code
    if (!crew) {
        return res.status(404).json({
            success: false,
            message: 'crew  not found'
        })
    }

    // Otherwise we will return the Maintenance report object
    return res.json({
        success: true,
        data: crew
    })
}

export const deleteCrewById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'Crew not found'
        })
    }

    return res.json({
        success: true,
        message: 'Crew deleted'
    })
}


export const patchCrew = async (req, res, next) => {
    const id = parseInt(req.params.id); // Crew ID from the URL, converted to integer

    // Check if the id is a valid integer
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
        });
    }

    const updateData = req.body; // Data to update

    try {
        const updatedCrew = await updateById(id, updateData);
        res.json({
            success: true,
            data: updatedCrew,
        });
    } catch (err) {
        next(err); // Handle errors (crew not found, iata/icao already in use, etc.)
    }
};

export const addCrewMember = async (req, res, next) => {
    const { fullName, dateOfBirth, hireDate, email, phone, address, licenseNumber, role} = req.body;
    let crew;

    try {
        crew = await addCrew(fullName, dateOfBirth, hireDate, email, phone, address, licenseNumber, role);
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created crew as the response
    res.json({
        success: true,
        data: crew,
    });
}

export const getCrewStats = async (req, res, next) => {
    const crewId = parseInt(req.params.id); // Crew ID from the request parameters
  
    try {
      const stats = await getCrewFlightStats(crewId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err); // Handle errors (crew not found, etc.)
    }
  };