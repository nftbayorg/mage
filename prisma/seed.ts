import { PrismaClient } from "prisma/prisma-client";

async function seed() {
  const prisma = new PrismaClient()

  const user = await prisma.user.create({
    data: {
      email: "alice@test.com",
      name: "Alice Test"
    },
  });

  const fbCollection = await prisma.collection.create({
    data: {
      name: "Fuzzy bears",
      userId: user.id
    },
  });

  const hpCollection = await prisma.collection.create({
    data: {
      name: "Happy penguins",
      userId: user.id
    },
  });

  const gpCollection = await prisma.collection.create({
    data: {
      name: "Grumpy pigs",
      userId: user.id
    },
  });

  const sfCollection = await prisma.collection.create({
    data: {
      name: "Shy frogs",
      userId: user.id
    },
  });

  const ldCollection = await prisma.collection.create({
    data: {
      name: "Lazy ducks",
      userId: user.id
    },
  });

  const nlCollection = await prisma.collection.create({
    data: {
      name: "Noisy lamas",
      userId: user.id
    },
  });

  const ntrCollection = await prisma.collection.create({
    data: {
      name: "Not the rum!",
      userId: user.id
    },
  });


  const ntCollection = await prisma.collection.create({
    data: {
      name: "Now then",
      userId: user.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Big fuzzy",
      userId: user.id,
      collectionId: fbCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Nico fuzzy",
      userId: user.id,
      collectionId: fbCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Furzo",
      userId: user.id,
      collectionId: hpCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Pingu",
      userId: user.id,
      collectionId: hpCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Herbert",
      userId: user.id,
      collectionId: gpCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Colin",
      userId: user.id,
      collectionId: gpCollection.id
    },
  });
  
  await prisma.item.create({
    data: {
      name: "Derek",
      userId: user.id,
      collectionId: sfCollection.id
    },
  });
  
  await prisma.item.create({
    data: {
      name: "Paulo",
      userId: user.id,
      collectionId: sfCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Grant",
      userId: user.id,
      collectionId: sfCollection.id
    },
  });

  await prisma.item.create({
    data: {
      name: "Rich",
      userId: user.id,
      collectionId: sfCollection.id
    },
  });


  
  
}

seed();
