import prisma from "../db.js";

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            // Include the related model and base airport with their names
            flight: {
                select: {
                    flightNumber: true,
                    date: true, // Get the model name
                },
            },
            crew: {
                select: {
                    fullName: true,
                    role: true,
                },
            },
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
    return await prisma.crewAssignement.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.crewAssignement.findUnique({
        select: {
            id: true,
            // Include the related model and base airport with their names
            flight: {
                select: {
                    flightNumber: true,
                    date: true,
                },
            },
            crew: {
                select: {
                    fullName: true,
                    role: true,
                },
            },
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
        await prisma.crewAssignement.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};


export const updateById = async (id, updateData) => {
    // Check if the maintenance report exists
    const assignement = await prisma.crewAssignement.findUnique({
        where: { id },
    });

    if (!assignement) {
        throw new Error("assignement  not found");
    }

    // Patch the maintenance report data (only the fields provided will be updated)
    const updatedAssignement = await prisma.crewAssignement.update({
        where: { id },
        data: updateData, // Only fields in updateData will be updated
        select: {
            id: true,
            flightId: true,
            crewId: true,
        },
    });

    return updatedAssignement;
};

export const addAssignement = async (flightId, crewId) => {

    const assignement = await prisma.crewAssignement.create({
        data: {
            flightId,
            crewId,

        },
        select: {
            id: true,
            flightId: true,
            crewId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return assignement;
}