import prisma from "../db.js";

export const getAll = async (sortBy, sortDirection) => {
    // If the sortBy parameter is provided, we will sort the aircraft model array
    let options = {
        select: {
            id: true,
            manufacturer: true,
            name: true,
            crewCapacity: true,
            passengerCapacity: true,
            cargoCapacity: true,
            height: true,
            length: true,
            maxRange: true,
            speed: true,
            fuelCapacity: true,
            fuelBurn: true,
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = "asc";
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }

    return await prisma.aircraftModel.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.aircraftModel.findUnique({
        select: {
            id: true,
            manufacturer: true,
            name: true,
            crewCapacity: true,
            passengerCapacity: true,
            cargoCapacity: true,
            height: true,
            length: true,
            maxRange: true,
            speed: true,
            fuelCapacity: true,
            fuelBurn: true,
        },
        where: {
            id,
        },
    });
};

export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.aircraftModel.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};


export const createAircraftModel = async (
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
    fuelBurn
) => {
    // Check if the model already exists
    const count = await prisma.aircraftModel.count({
        where: {
            name,
        },
    });

    if (count > 0) throw new Error("this model already exists");

    // Create the Aircraft model
    const aircraftModel = await prisma.aircraftModel.create({
        data: {
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
            fuelBurn,
        },
        select: {
            id: true,
            manufacturer: true,
            name: true,
            crewCapacity: true,
            passengerCapacity: true,
            cargoCapacity: true,
            height: true,
            length: true,
            maxRange: true,
            speed: true,
            fuelCapacity: true,
            fuelBurn: true,
        },
    });

    return aircraftModel;
};

export const updateAircraftModel = async (id, updateData) => {
    // Check if the Aircraft model exists
    const aircraftModel = await prisma.aircraftModel.findUnique({
        where: { id },
    });

    if (!aircraftModel) {
        throw new Error("Aircraft model not found");
    }

    // Optional: Validate uniqueness of model name if its are being updated
    if (updateData.name) {
        const nameExists = await prisma.aircraftModel.findUnique({
            where: { name: updateData.name },
        });

        if (iataExists && nameExists.id !== id) {
            throw new Error("Model name is already in use");
        }
    }

    // Patch the aircraft model data (only the fields provided will be updated)
    const updatedAircraftModel = await prisma.aircraftModel.update({
        where: { id },
        data: updateData, // Only fields in updateData will be updated
        select: {
            id: true,
            manufacturer: true,
            name: true,
            crewCapacity: true,
            passengerCapacity: true,
            cargoCapacity: true,
            height: true,
            length: true,
            maxRange: true,
            speed: true,
            fuelCapacity: true,
            fuelBurn: true,
        },
    });

    return updatedAircraftModel;
};
