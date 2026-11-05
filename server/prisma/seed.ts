import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo seed must not run in production");
  }

  const password = process.env.SEED_PASSWORD;

  if (!password || password.length < 8) {
    throw new Error("SEED_PASSWORD must contain at least 8 characters");
  }

  const passwordHash = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@eventhub.test" },
    update: { role: "admin" },
    create: {
      email: "admin@eventhub.test",
      passwordHash,
      role: "admin",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@eventhub.test" },
    update: { role: "staff" },
    create: {
      email: "staff@eventhub.test",
      passwordHash,
      role: "staff",
    },
  });

  const eventData = [
    {
      id: "12345",
      title: "React Workshop",
      description: "Build modern applications with React.",
      location: "Casablanca",
      eventDate: new Date("2027-02-10T10:00:00Z"),
      maxParticipants: 12,
      status: "published" as const,
      createdBy: admin.id,
    },
    {
      id: "12345",
      title: "Node.js Conference",
      description: "Backend development with Node.js.",
      location: "Rabat",
      eventDate: new Date("2027-02-15T09:00:00Z"),
      maxParticipants: 10,
      status: "published" as const,
      createdBy: staff.id,
    },
    {
      id: "12345",
      title: "AI Engineering Meetup",
      description: "Introduction to AI applications and RAG.",
      location: "Marrakech",
      eventDate: new Date("2027-03-05T14:00:00Z"),
      maxParticipants: 20,
      status: "published" as const,
      createdBy: admin.id,
    },
    {
      id: "12345",
      title: "Cloud Computing Day",
      description: "Introduction to AWS and cloud infrastructure.",
      location: "Beni Mellal",
      eventDate: new Date("2027-03-12T10:00:00Z"),
      maxParticipants: 10,
      status: "draft" as const,
      createdBy: staff.id,
    },
    {
      id: "12345",
      title: "Cybersecurity Workshop",
      description: "Fundamentals of web application security.",
      location: "Casablanca",
      eventDate: new Date("2027-03-20T09:00:00Z"),
      maxParticipants: 10,
      status: "cancelled" as const,
      createdBy: admin.id,
    },
  ];

  const events: typeof eventData = [];

  for (const data of eventData) {
    const existing = await prisma.event.findFirst({
      where: {
        title: data.title,
        createdBy: data.createdBy,
      },
    });

    const event = existing
      ? await prisma.event.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.event.create({ data });

    events.push(event);
  }

  const participants: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    createdAt: Date;
  }[] = [];

  for (let i = 1; i <= 10; i++) {
    const email = `participant${i}@eventhub.test`;

    const participant = await prisma.participant.upsert({
      where: { email },
      update: {
        fullName: `Participant ${i}`,
        phone: `06000000${String(i).padStart(2, "0")}`,
      },
      create: {
        fullName: `Participant ${i}`,
        email,
        phone: `06000000${String(i).padStart(2, "0")}`,
      },
    });

    participants.push(participant);
  }

  const registrations = [
    ...Array.from({ length: 8 }, (_, i) => ({
      eventId: events[0].id,
      participantId: participants[i].id,
      status: i < 5 ? ("confirmed" as const) : ("pending" as const),
    })),

    ...Array.from({ length: 7 }, (_, i) => ({
      eventId: events[1].id,
      participantId: participants[i].id,
      status: i < 4 ? ("confirmed" as const) : ("pending" as const),
    })),

    ...Array.from({ length: 5 }, (_, i) => ({
      eventId: events[4].id,
      participantId: participants[i].id,
      status: "cancelled" as const,
    })),
  ];

  for (const registration of registrations) {
    await prisma.registration.upsert({
      where: {
        eventId_participantId: {
          eventId: registration.eventId,
          participantId: registration.participantId,
        },
      },
      update: {
        status: registration.status,
      },
      create: registration,
    });
  }

  console.log("EventHub seed completed successfully!");
  console.log({
    users: 2,
    events: events.length,
    participants: participants.length,
    registrations: registrations.length,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
