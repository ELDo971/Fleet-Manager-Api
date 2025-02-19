import prisma from "../db.js";
import geolib from 'geolib';

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            flightNumber: true,
            plane: {
                select: {
                    tailNumber: true,
                    model: {
                        select: {
                            manufacturer: true,
                            name: true,
                        }
                    } // Get the model name
                },
            },
            departureAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
            arrivalAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
            date: true,
            expectedDepartureTime: true,
            expectedArrivalTime: true,
            departureTime: true,
            arrivalTime: true,
            flightDuration: true,
            departureGate: true,
            arrivalGate: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = "asc";
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }
    return await prisma.flight.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.flight.findUnique({
        select: {
            id: true,
            flightNumber: true,
            plane: {
                select: {
                    tailNumber: true,
                    model: {
                        select: {
                            manufacturer: true,
                            name: true,
                        }
                    } // Get the model name
                },
            },
            departureAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
            arrivalAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
            date: true,
            expectedDepartureTime: true,
            expectedArrivalTime: true,
            departureTime: true,
            arrivalTime: true,
            flightDuration: true,
            departureGate: true,
            arrivalGate: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            id,
        },
    });
};

export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.flight.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};


export const updateById = async (id, updateData) => {
    // Check if the user exists
    const flight = await prisma.flight.findUnique({
        where: { id },
    });

    if (!flight) {
        throw new Error('flight not found');
    }

    if (updateData.flightNumber) {
        const flightNumberExists = await prisma.user.findUnique({
            where: { flightNumber: updateData.flightNumber }
        });

        if (flightNumberExists && flightNumberExists.id !== id) {
            throw new Error('flight Number is already in use');
        }
    }

    // Patch the user data (only the fields provided will be updated)
    const updatedflight = await prisma.flight.update({
        where: { id },
        data: updateData,  // Only fields in updateData will be updated
        select: {
            flightNumber: true,
            aircraftId: true,
            departureAirportId: true,
            arrivalAirportId: true,
            date: true,
            expectedDepartureTime: true,
            expectedArrivalTime: true,
            departureTime: true,
            arrivalTime: true,
            flightDuration: true,
            departureGate: true,
            arrivalGate: true,
            status: true,
        },
    });

    return updatedflight;
};

export const addFlight = async (
    flightNumber,
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
) => {
    // Check if the flight number already exists
    const count = await prisma.flight.count({
        where: {
            flightNumber,
        },
    });

    if (count > 0) {
        throw new Error('This flight number already exists');
    }

    // Create the new flight
    const flight = await prisma.flight.create({
        data: {
            flightNumber,
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
        },
        select: {
            id: true,
            flightNumber: true,
            aircraftId: true,
            departureAirportId: true,
            arrivalAirportId: true,
            date: true,
            expectedDepartureTime: true,
            expectedArrivalTime: true,
            departureTime: true,
            arrivalTime: true,
            flightDuration: true,
            departureGate: true,
            arrivalGate: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return flight;
};

export const getEstimatedLocation = async (flightId) => {
    const flight = await prisma.flight.findUnique({
        where: { id: flightId },
        include: {
          departureAirport: true,
          arrivalAirport: true,
        },
      });
    
      if (!flight) {
        throw new Error('Flight not found');
      }
    
      if (flight.status !== 'IN_PROGRESS') {
        throw new Error('Plane not actually flying');
      }
    
      const { departureAirport, arrivalAirport, expectedDepartureTime, expectedArrivalTime } = flight;
      const currentTime = new Date();
      const departureTime = new Date(expectedDepartureTime);
      const elapsedTime = (currentTime - departureTime) / 1000 / 60 / 60; // hours
    
      const totalDuration = (new Date(expectedArrivalTime) - departureTime) / 1000 / 60 / 60; // hours
      const departureCoords = {
        latitude: departureAirport.latitude,
        longitude: departureAirport.longitude,
      };
      const arrivalCoords = {
        latitude: arrivalAirport.latitude,
        longitude: arrivalAirport.longitude,
      };
    
      const distance = geolib.getDistance(departureCoords, arrivalCoords); // Distance in meters
      const estimatedDistanceTraveled = (elapsedTime / totalDuration) * distance; // Calculate estimated distance traveled in meters
    
      // Now use geolib's computeDestinationPoint function to estimate the plane's location
      const estimatedCoords = geolib.computeDestinationPoint(
        departureCoords,
        estimatedDistanceTraveled, // distance in meters
        0 // bearing (0 means directly east, in case of a straight path)
      );
    
      return {
        flightNumber: flight.flightNumber,
        estimatedLatitude: estimatedCoords.latitude,
        estimatedLongitude: estimatedCoords.longitude,
        elapsedTime,
        totalDuration,
      };
};