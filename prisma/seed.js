import { PrismaClient } from '@prisma/client';
import { create } from '../services/users.service';
const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.create({
      where: { email: 'alice@prisma.io' },
      update: {},
      create: {
        email: 'alice@prisma.io',
        name: 'Alice',
        posts: {
          create: {
            title: 'Check out Prisma with Next.js',
            content: 'https://www.prisma.io/nextjs',
            published: true,
          },
        },
      },
    })
const seedUsers = async () => {
    const users = [
        {
            fullName: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            password: 'password123',  // Plaintext password
            role: 'ADMIN',
            status: 'ACTIVE',
        },
        {
            fullName: 'Bob Smith',
            email: 'bob.smith@example.com',
            password: 'password456',  // Plaintext password
            role: 'USER',
            status: 'ACTIVE',
        },
        {
            fullName: 'Carol Lee',
            email: 'carol.lee@example.com',
            password: 'password789',  // Plaintext password
            role: 'MANAGER',
            status: 'ACTIVE',
        },
    ];

    // Save the users to the database
    for (let user of users) {
        await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,  // Hashed password
                fullName: user.fullName,
                role: user.role,
                status: user.status,
            }
        });
    }

    console.log('Users seeded successfully!');
};


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
