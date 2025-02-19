import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Returns all users, sorted by the provided field and direction
 * @param {string} sortBy - The field to sort by (optional)
 * @param {string} sortDirection - The direction to sort by (optional, default is 'ASC')
 * @returns {Array} - An array of users
 */
export const getAll = async (sortBy, sortDirection) => {
    // If the sortBy parameter is provided, we will sort the users array
    let options = {
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true, 
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return await prisma.user.findMany(options)
}

/**
 * Returns a single user by its id
 * @param {number} id - The id of the user to get 
 * @returns {object} - The user object or null if not found
 */
export const getById = async (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return await prisma.user.findUnique({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            id
        }
    })
}

/**
 * Deletes a user by its id
 * @param {number} id 
 * @returns {boolean} - True if the user was deleted, false if not found
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.user.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}



export const create = async (fullName, email, password, role = 'USER', status = 'ACTIVE') => {
    // Check if the email already exists
    const count = await prisma.user.count({
        where: {
            email
        }
    });

    if (count > 0) throw new Error('Email already exists');

    // Hash the password before saving to the database
    const encryptedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

    // Create the user
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: encryptedPassword,
            role,  // Default to 'USER' if not provided
            status,  // Default to 'ACTIVE' if not provided
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
        }
    });

    return user;
}

export const updateById = async (id, updateData) => {
    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Optional: Validate uniqueness of email if it is being updated
    if (updateData.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: updateData.email }
        });

        if (emailExists && emailExists.id !== id) {
            throw new Error('Email is already in use');
        }
    }

    // Patch the user data (only the fields provided will be updated)
    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,  // Only fields in updateData will be updated
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

export const login = async (email, password) => {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (!user) throw new Error('User not found')

    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid password')

    // Generate a token here
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    return token
}