import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // create a user
  const user = await prisma.user.create({
    data: {
      email: "hero@dhanoo.com",
      name: "Dhanoo",
    },
  });

  // create expenses
  await prisma.expense.create({
    data: {
      amount: 2000,
      currency: "LKR",
      note: "Breakfast",
      userId: user.id,
    },
  });

  await prisma.expense.create({
    data: {
      amount: 5500,
      currency: "LKR",
      note: "Shopping",
      userId: user.id,
    },
  });

  console.log("Seed completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
