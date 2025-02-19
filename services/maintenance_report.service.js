import prisma from "../db.js";

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            aircraftId: true,
            maintenanceType: true,
            status: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            resolvedAt: true,
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = "asc";
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }
    return await prisma.maintenanceReport.findMany(options);
};

export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.maintenanceReport.findUnique({
        select: {
            id: true,
            aircraftId: true,
            maintenanceType: true,
            status: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            resolvedAt: true,
        },
        where: {
            id,
        },
    });
};

export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.maintenanceReport.delete({
            where: {
                id,
            },
        });
        return true;
    }
    return false;
};



export const createMaintenanceReport = async (
    aircraftId,
    maintenanceType,
    status,
    description,
    resolvedAt
) => {
    // Check if the aircraftId exists
    const plane = await prisma.aircraft.findUnique({
        where: { id: aircraftId },
    });

    if (!plane) throw new Error("Aircraft with the provided ID does not exist.");
    // Create the airport
    const maintenanceReport = await prisma.maintenanceReport.create({
        data: {
            aircraftId,
            maintenanceType,
            status,
            description,
            resolvedAt,
        },
        select: {
            id: true,
            aircraftId: true,
            maintenanceType: true,
            status: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            resolvedAt: true,
        },
    });

    return maintenanceReport;
};

export const updateById = async (id, updateData) => {
    // Check if the maintenance report exists
    const maintenanceReport = await prisma.maintenanceReport.findUnique({
        where: { id },
    });

    if (!maintenanceReport) {
        throw new Error("Maintenance report not found");
    }

    // Patch the maintenance report data (only the fields provided will be updated)
    const updatedReport = await prisma.maintenanceReport.update({
        where: { id },
        data: updateData, // Only fields in updateData will be updated
        select: {
            id: true,
            aircraftId: true,
            maintenanceType: true,
            status: true,
            description: true,
            updatedAt: true,
            resolvedAt: true,
        },
    });

    return updatedReport;
};


export const getRecurringMaintenanceIssues = async () => {
    const results = await prisma.maintenanceReport.groupBy({
        by: ['maintenanceType', 'aircraftId'],
        _count: {
            maintenanceType: true,
        },
        orderBy: {
            _count: {
                maintenanceType: 'desc',
            },
        },
    });

    // Map results to include the aircraft model details
    const enrichedResults = await Promise.all(
        results.map(async (result) => {
            const aircraft = await prisma.aircraft.findUnique({
                where: { id: result.aircraftId },
                include: {
                    model: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return {
                aircraftModel: aircraft.model.name,
                maintenanceType: result.maintenanceType,
                occurrenceCount: result._count.maintenanceType,
            };
        })
    );

    return enrichedResults;
};