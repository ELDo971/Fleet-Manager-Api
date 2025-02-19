import prisma from "../db.js";

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            tailNumber: true,
            productionDate: true,
            acquisitionDate: true,
            status: true,
            // Include the related model and base airport with their names
            model: {
                select: {
                    manufacturer: true,
                    name: true, // Get the model name
                },
            },
            baseAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = "asc";
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }
    return await prisma.aircraft.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.aircraft.findUnique({
        select: {
            id: true,
            tailNumber: true,
            productionDate: true,
            acquisitionDate: true,
            status: true,
            // Include the related model and base airport with their names
            model: {
                select: {
                    manufacturer: true,
                    name: true, // Get the model name
                },
            },
            baseAirport: {
                select: {
                    name: true,
                    iata: true,
                    city: true,
                    country: true,// Get the airport name
                },
            },
        },
        where: {
            id,
        },
    });
};

export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.aircraft.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};



export const updateById = async (id, updateData) => {
    // Check if the aircraft exists
    const aircraft = await prisma.aircraft.findUnique({
        where: { id },
    });

    if (!aircraft) {
        throw new Error("Aircraft not found");
    }

    // If tailNumber is being updated, check for uniqueness
    if (updateData.tailNumber) {
        const tailnumExists = await prisma.aircraft.findUnique({
            where: { tailNumber: updateData.tailNumber }
        });

        if (tailnumExists && tailnumExists.id !== id) {
            throw new Error('Tail number is already in use');
        }
    }

    // Update the aircraft data (only the fields provided will be updated)
    const updatedAircraft = await prisma.aircraft.update({
        where: { id },
        data: updateData, // Only fields in updateData will be updated
        select: {
            id: true,
            tailNumber: true,
            baseAirportId: true,
            modelId: true,
            productionDate: true,
            acquisitionDate: true,
            status: true,
        },
    });

    return updatedAircraft;
};

export const addAircraft = async (tailNumber, baseAirportId, modelId, productionDate, acquisitionDate, status = 'ACTIVE') => {
    // Check if the email already exists
    const count = await prisma.aircraft.count({
        where: {
            tailNumber
        }
    });

    if (count > 0) throw new Error('tail Number already exists');

    const aircraft = await prisma.aircraft.create({
        data: {
            tailNumber,
            baseAirportId,
            modelId,
            productionDate,
            acquisitionDate,
            status,
        },
        select: {
            id: true,
            tailNumber: true,
            baseAirportId: true,
            modelId: true,
            productionDate: true,
            acquisitionDate: true,
            status: true,
        },
    });

    return aircraft;
}
