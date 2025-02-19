import prisma from "../db.js";

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            hireDate: true,
            email: true,
            phone: true,
            address: true,
            licenseNumber: true,
            role: true,
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
    return await prisma.crew.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.crew.findUnique({
        select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            hireDate: true,
            email: true,
            phone: true,
            address: true,
            licenseNumber: true,
            role: true,
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
        await prisma.crew.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};

export const updateById = async (id, updateData) => {
    // Check if the crew member exists
    const crew = await prisma.crew.findUnique({
        where: { id },
    });

    if (!crew) {
        throw new Error("crew  not found");
    }
    if (updateData.email) {
        const emailExists = await prisma.crew.findUnique({
            where: { email: updateData.email }
        });

        if (emailExists && emailExists.id !== id) {
            throw new Error('email code is already in use');
        }
    }

    if (updateData.licenseNumber) {
        const licenseNumberExists = await prisma.crew.findUnique({
            where: { licenseNumber: updateData.licenseNumber }
        });

        if (licenseNumberExists && licenseNumberExists.id !== id) {
            throw new Error('licenseNumber code is already in use');
        }
    }

    // Patch the maintenance report data (only the fields provided will be updated)
    const updatedCrew = await prisma.crew.update({
        where: { id },
        data: updateData, // Only fields in updateData will be updated
        select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            email: true,
            phone: true,
            address: true,
            licenseNumber: true,
            role: true,
            status: true,
        },
    });

    return updatedCrew;
};

export const addCrew = async (fullName, dateOfBirth, hireDate, email, phone, address, licenseNumber, role) => {
    // Check if both email and license number already exist together
    const count = await prisma.crew.count({
        where: {
            AND: [
                { email },
                { licenseNumber },
            ],
        },
    });

    if (count > 0) throw new Error('A crew member with this email and license number already exists');

    // Create the new crew member
    const crew = await prisma.crew.create({
        data: {
            fullName,
            dateOfBirth,
            hireDate,
            email,
            phone,
            address,
            licenseNumber,
            role,
        },
        select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            hireDate: true,
            email: true,
            phone: true,
            address: true,
            licenseNumber: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return crew;
};

export const getCrewFlightStats = async (id) => {
    // Fetch the crew along with their assignments and flight data
    const crew = await prisma.crew.findUnique({
        where: {
            id, // Crew ID passed from the controller
        },
        include: {
            CrewAssignment: {
                include: {
                    flight: {
                        select: {
                            flightDuration: true, // Flight duration in hours
                            aircraftId: true,     // Aircraft ID to relate to the aircraft model
                        },
                    },
                },
            },
        },
    });

    if (!crew) {
        throw new Error('Crew member not found');
    }

    // Extract flight stats from the assignments
    const flightStats = await Promise.all(
        crew.CrewAssignment.map(async (assignment) => {
            // Fetch the aircraft model for each flight assignment
            const aircraft = await prisma.aircraft.findUnique({
                where: {
                    id: assignment.flight.aircraftId,
                },
                select: {
                    model: {
                        select: {
                            name: true, // Aircraft model name
                        },
                    },
                },
            });

            return {
                aircraftModel: aircraft?.model.name, // Aircraft model name
                flightDuration: assignment.flight.flightDuration, // Flight duration
            };
        })
    );

    // Calculate total flight hours
    const totalFlightHours = flightStats.reduce((acc, flight) => acc + flight.flightDuration, 0);

    // Count the number of times each aircraft model was flown
    const aircraftCount = flightStats.reduce((acc, flight) => {
        const aircraftModel = flight.aircraftModel;
        acc[aircraftModel] = (acc[aircraftModel] || 0) + 1;
        return acc;
    }, {});

    // Find the most flown aircraft model
    const mostFlownAircraft = Object.entries(aircraftCount).reduce((acc, [model, count]) => {
        if (!acc || count > acc.count) {
            acc = { model, count };
        }
        return acc;
    }, null);

    return {
        totalFlightHours,
        mostFlownAircraft,
    };
};