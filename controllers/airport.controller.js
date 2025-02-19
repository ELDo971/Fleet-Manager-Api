import { getAll, getById, deleteById, createAirport, updateAirport , getWeatherForAirport } from '../services/airport.service.js'

export const getAirport = async (req, res) => {
    // Calling the service function with the sortBy and sortDir parameters from the query string
    // The query string is an object containing all the parameters sent in the URL after the ? character
    // These values can be null or undefined if not provided
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}


export const getAirportById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const airport = await getById(parseInt(req.params.id))

    // If the airport is not found, we will return a 404 status code
    if (!airport) {
        return res.status(404).json({
            success: false,
            message: 'airport not found'
        })
    }

    // Otherwise we will return the airport object
    return res.json({
        success: true,
        data: airport
    })
}

export const deleteAirportById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'airport not found'
        })
    }

    return res.json({
        success: true,
        message: 'airport deleted'
    })
}



export const addAirport = async (req, res, next) => {
    // We get fullName, email, password, role, and status from the request body
    const { name, iata, icao, city, country, latitude, longitude, timeZone } = req.body;
    let airport;

    try {
        // Call the create service with the full name, email, password, and optional role/status
        airport = await createAirport(name, iata, icao, city, country, latitude, longitude, timeZone);
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created airport as the response
    res.json({
        success: true,
        data: airport,
    });
}


export const patchAirport = async (req, res, next) => {
    const id = parseInt(req.params.id); // Airport ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedAirport = await updateAirport(id, updateData);
        res.json({
            success: true,
            data: updatedAirport,
        });
    } catch (err) {
        next(err); // Handle errors (airport not found, iata/icao already in use, etc.)
    }
};

export const getAirportWeather = async (req, res) => {
    try {
        // Pass the IATA code directly as a string, no need for parseInt
        const weatherData = await getWeatherForAirport(req.params.iata);
        return res.json({
            success: true,
            data: weatherData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};