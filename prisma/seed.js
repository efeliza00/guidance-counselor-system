import { PrismaClient, Status, StudentRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Users with Profiles
  const user1 = await prisma.user.create({
    data: {
      username: "admin",
      password: "hashedpassword1",
      profile: {
        create: {
          email: "admin@example.com",
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "counselor1",
      password: "hashedpassword2",
      profile: {
        create: {
          email: "counselor1@example.com",
        },
      },
    },
  });

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      name: "Alice Johnson",
      contact: "alice@example.com",
      role: StudentRole.COMPLAINANT,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Bob Smith",
      contact: "bob@example.com",
      role: StudentRole.RESPONDENT,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      name: "Charlie Brown",
      contact: "charlie@example.com",
      role: StudentRole.RESPONDENT,
    },
  });

  const complaint1 = await prisma.complaint.create({
    data: {
      title: "Bullying Incident",
      overview: "Alice reported that Bob bullied her during recess.",
      status: Status.PENDING,
      user: { connect: { id: user1.id } },
      students: {
        connect: [{ id: student1.id }, { id: student2.id }],
      },
    },
    include: { students: true },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      title: "Cheating in Exam",
      overview: "Charlie was reported cheating in Math exam.",
      status: Status.IN_PROGRESS,
      user: { connect: { id: user2.id } },
      students: {
        connect: [{ id: student3.id }, { id: student1.id }],
      },
    },
    include: { students: true },
  });

  console.log("✅ Seeding complete!");
  console.log({ user1, user2, complaint1, complaint2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
