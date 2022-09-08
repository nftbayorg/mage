import { PrismaClient } from "prisma/prisma-client";

async function seed() {
  const prisma = new PrismaClient()

  // Create some users.
  const userAlice = await prisma.user.create({
    data: {
      email: "alice@test.com",
      name: "Alice Test"
    },
  });

  const userBob = await prisma.user.create({
    data: {
      email: "bob@test.com",
      name: "Bob Test"
    },
  });

  const userDwane = await prisma.user.create({
    data: {
      email: "dwane@test.com",
      name: "Dwane Test"
    },
  });

  // Create a default Wallet for each user.
  for (const user of [userAlice, userBob, userDwane]) {
    await prisma.wallet.create({
      data: {
        virtual: true,
        userId: user.id
      }
    })
  }

  // Create some Collections.
  const collections = [{
      name: "Fuzzy bears",
      nfts: ["Big fuzzy", "Nick fury", "Furzo"],
      userId: userAlice.id,
      color: "yellow"
    }, { 
      name: "Happy penguins",
      nfts: ["Pingu", "Herbert", "Alfonzo"],
      userId: userBob.id,
      color: "blue"
    }, {
      name: "Grumpy pigs",
      nfts: ["Amy Swinehouse", "Beatrix Trotter", "Porky", "Truffle"],
      userId: userBob.id,
      color: "cyan"
    }, {
      name: "Shy frogs",
      nfts: ["Anthony Hopkins", "Ribbit", "Kermit", "Trevor", "Toad"],
      userId: userBob.id,
      color: "red"
    }, {
      name: "Lazy ducks",
      nfts: ["Bill", "Moby Duck", "Norris"],
      userId: userDwane.id,
      color: "green"
    }, {
      name: "Noisy lamas",
      nfts: ["Dalai", "Del Rey"],
      userId: userDwane.id,
      color: "purple"
    }, {
      name: "Hungry monkeys",
      nfts: ["Cuddles", "Marcel", "Bubbles"],
      userId: userDwane.id,
      color: "pink"
    }
  ];

  for (const collection of collections) {
    const storedCollection = await prisma.collection.create({
      data: {
        name: collection.name,
        description: '',
        userId: collection.userId,
        color: collection.color
      },
    }); 
      

    // Each NFT is an Edition (a single copy) of the NFT (think prints of artwork).
    for (const nft of collection.nfts) {
      // Create an NFT set for each NFT.
      const storedNftSet = await prisma.nFTSet.create({
        data: {
          collectionId: storedCollection.id
        }
      })

      const wallet = await prisma.wallet.findFirst({
        where: {
          userId: collection.userId
        }
      })

      if (wallet) {
        await prisma.nFTEdition.create({
          data: {
            nftSetId: storedNftSet.id,
            tokenAddress: null,
            name: nft,
            minted: false,
            ownerId: wallet?.id,
            blockchainId: 'Etherium Mainnet',
            url: `/images/nft${Math.floor(Math.random() * 9)+1}.png`,          
          },
        });
      }
    }
  }

  // Create some Auctions for some of the assets.
  const savedCollections = await prisma.collection.findMany({
    include: {
      nftSets: {
        include: {
          nftEditions: true
        }
      },
      user: true      
    }
  });

  const start = new Date();

  for (const collection of savedCollections) {
    const end = getRandomDate(start, new Date(start.getFullYear(), start.getMonth()+4, start.getDate()))

    if (!collection?.nftSets[0]) continue;

    const auction = await prisma.auction.create({
      data: {
        start,
        end,
        fixed: false,
        userId: collection.userId
      }
    })

    for (const nftSet of collection.nftSets) {
      for (const lot of nftSet.nftEditions) {
        await prisma.lot.create({
          data: {
            auctionId: auction.id,
            nftEditionId: lot.id,
            reservePrice: Math.round(Math.floor(Math.random() * 100)+1) / 1000,
            sold: false
          }
        })
      }
    }
  }

  function getRandomDate(from: Date, to: Date) {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  }
}

seed();
