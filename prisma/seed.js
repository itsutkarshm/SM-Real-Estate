const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const chalk = (await import('chalk')).default; // For CLI colors
  const user = await prisma.user.findUnique({
    where: {
      email: 'admin@smrealty.com', 
    },
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash('Smrealtyadmin', 10); // Hash the password
    await prisma.user.create({
      data: {
        email: 'admin@smrealty.com', 
        password: hashedPassword,
      },
    })
    console.log(chalk.green('Default user created'))
  } else {
    console.log(chalk.yellow('Default user already exists'))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
