const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const chalk = (await import('chalk')).default; // For CLI colors

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(chalk.red('Admin email or password not set in environment variables'));
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash the password
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(chalk.green('Admin user created'));
  } else {
    console.log(chalk.yellow('Admin user already exists'));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
