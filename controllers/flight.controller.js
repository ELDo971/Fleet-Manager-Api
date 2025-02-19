import { getAll, getById, deleteById, addFlight, updateById ,getEstimatedLocation } from '../services/flight.service.js'

export const getFlight = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

export const getFlightById = async (req, res) => {
    // Calling the service function with the id parsed as an integer, the id is a path parameter from the URL, it's a string, declared in the router
    const flight = await getById(parseInt(req.params.id))

    // If the flight is not found, we will return a 404 status code
    if (!flight) {
        return res.status(404).json({
            success: false,
            message: 'flight  not found'
        })
    }

    // Otherwise we will return the Maintenance report object
    return res.json({
        success: true,
        data: flight
    })
}

export const deleteflightById = async (req, res) => {
    const hasBeenDeleted = await deleteById(parseInt(req.params.id))
    if (!hasBeenDeleted) {
        return res.status(404).json({
            success: false,
            message: 'flight not found'
        })
    }

    return res.json({
        success: true,
        message: 'flight deleted'
    })
}



export const patchFlight = async (req, res, next) => {
    const id = parseInt(req.params.id); // flight ID from the URL
    const updateData = req.body; // Data to update

    try {
        const updatedFlight = await updateById(id, updateData);
        res.json({
            success: true,
            data: updatedFlight,
        });
    } catch (err) {
        next(err); // Handle errors (flight not found, iata/icao already in use, etc.)
    }
};


export const addFlightSchedule = async (req, res, next) => {
    const { flightNumber,
        aircraftId,
        departureAirportId,
        arrivalAirportId,
        date,
        expectedDepartureTime,
        expectedArrivalTime,
        departureTime,
        arrivalTime,
        flightDuration,
        departureGate,
        arrivalGate,
        status,
    } = req.body;
    let flight;

    try {
        flight = await addFlight(flightNumber,
            aircraftId,
            departureAirportId,
            arrivalAirportId,
            date,
            expectedDepartureTime,
            expectedArrivalTime,
            departureTime,
            arrivalTime,
            flightDuration,
            departureGate,
            arrivalGate,
            status,);
    } catch (err) {
        // Handle errors (e.g., email already exists)
        return next(err);
    }

    // Return the created crew as the response
    res.json({
        success: true,
        data: flight,
    });
}

export const getFlightLocation = async (req, res) => {
    const id = parseInt(req.params.id);
  
    try {
      const location = await getEstimatedLocation(Number(id));
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };