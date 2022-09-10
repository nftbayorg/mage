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
  const collections = [
    { 
      name: "Looks Whale Official",
      description: "A collection of 6969 utility-enabled PFPs that feature a richly diverse and unique pool of 300+ traits. Internet culture, memes and gamblers in the same toxic environment. What's more, each Whale unlocks private roasting club membership and access to the Treasure Chests mechanism.",
      nfts: [
        {
          name: "#1162",
          url: "/images/NFT1.png",
        },
        {
          name: "#2542",
          url: "/images/NFT3.png",
        },
        {
          name: "#5576",
          url: "/images/NFT4.png",
        },
      ],
      userId: userBob.id,
      color: "blue"
    }, {
      name: "grumpls",
      description: 'Ets da Grumpls!! Dees speshul littel bebies stik arownd cuz we keeep em heppy an fed. An dey maek us heppy tuu! Aldo we dunt reely kno why... maebe ets da farts, butt we nevur tink about et tuu hard. Dey cum en all shaps an sizes, sumtims ef dey eat totuuo mush dey git a lil crezi, butt we luv dem aneeway. Wontim a Grumpl tol me eet needed a komputer ta peemale sumbodee butt we dunt kno wat a komputer es.',
      nfts: [
        {
          name: "grumpl #359",
          url: '/images/NFT2.png'
        },
        {
          name: "grumpl #1869",
          url: '/images/NFT5.png'
        },
        {
          name: "grumpl #603",
          url: '/images/NFT6.png'
        },
      ],
      userId: userAlice.id,
      color: "yellow"
    }, {
      name: "VoodoosClub",
      description: "https://twitter.com/Voodoosclub Voodoos club has devoted his life to studying potions of change,doing whatever it takes to find more potions recipes.",
      nfts: [
        {
          name: "VoodoosClub #4015",
          url: "/images/NFT7.png"
        },
        {
          name: "VoodoosClub #3393",
          url: "/images/NFT8.png"
        },
        {
          name: "VoodoosClub #8744",
          url: "/images/NFT9.png"
        },
        {
          name: "VoodoosClub #8676",
          url: "/images/NFT10.png"
        },
      ],
      userId: userBob.id,
      color: "cyan"
    }, {
      name: "BGYC",
      description: "10,000 Bored Gorillas Roaming Around The Blockchain",
      nfts: [
        {
          name: "Bored Gorilla Yacht Club #5016",
          url: "/images/NFT11.png"
        },
        {
          name: "Bored Gorilla Yacht Club #4783",
          url: "/images/NFT12.png"
        },
        {
          name: "Bored Gorilla Yacht Club #4286",
          url: "/images/NFT13.png"
        },
        {
          name: "Bored Gorilla Yacht Club #9080",
          url: "/images/NFT14.png"
        },
        {
          name: "Bored Gorilla Yacht Club #8933",
          url: "/images/NFT15.png"
        },
      ],
      userId: userBob.id,
      color: "red"
    }, {
      name: "DigiDaigaku Genesis",
      description: "DigiDaigaku is a collection of 2022 unique characters developed by Limit Break, a company founded by world famous game designers Gabriel Leydon and Halbert Nakagawa. Currently, DigiDaigaku characters live in a mysterious world unknown to outsiders, but in time, exciting details about their world will be revealed.Learn more about the project at: https://digidaigaku.com and https://twitter.com/DigiDaigaku",
      nfts: [
        {
          name: "DigiDaigaku #1157 - Nami",
          url: "/images/NFT16.png"
        },
        {
          name: "DigiDaigaku #447 - Surya",
          url: "/images/NFT17.png"
        },
        {
          name: "DigiDaigaku #1909 - Ariella",
          url: "/images/NFT18.png"
        },
        {
          name: "DigiDaigaku #719 - Teruko",
          url: "/images/NFT19.png"
        },
        {
          name: "DigiDaigaku #1492 - Grier",
          url: "/images/NFT20.png"
        },
      ],
      userId: userDwane.id,
      color: "green"
    }, {
      name: "Pudgy Penguins",
      description: "Pudgy Penguins is a collection of 8,888 NFTs, waddling through Web3. Embodying empathy & compassion, Pudgy Penguins are a beacon of positivity in the NFT Space. Each holder receives exclusive access to experiences, events, and more. Join the Huddle now and spread good vibes across the meta. pudgypenguins.com",
      nfts: [
        {
          name: "Pudgy Penguin #4124",
          url: "/images/NFT21.png"
        },
        {
          name: "Pudgy Penguin #8409",
          url: "/images/NFT22.png"
        },
        {
          name: "Pudgy Penguin #2300",
          url: "/images/NFT23.png"
        },
        {
          name: "Pudgy Penguin #2407",
          url: "/images/NFT24.png"
        },

      ],
      userId: userDwane.id,
      color: "purple"
    }
  ];

  for (const collection of collections) {
    const storedCollection = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
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
            name: nft.name,
            minted: false,
            ownerId: wallet?.id,
            blockchainId: 'Etherium Mainnet',
            url: nft.url,          
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
