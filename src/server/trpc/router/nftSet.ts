import { t, authedProcedure } from "../utils";
import { z } from "zod";
import { NFTStorage, Blob } from 'nft.storage';
import { TRPCError } from "@trpc/server";
import { computeViewLikeCount, DetailedNFTSet } from "../../../utils/computed-properties";
import { trpc } from "../../../utils/trpc";

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

export const nftSetRouter = t.router({
  getLean: t.procedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma?.nFTSet.findFirst({
      where: {
        id: input?.id,
      },
    });
  }),
  get: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async({ input, ctx }) => {
      const nftSet = await ctx.prisma?.nFTSet.findFirst({
        where: {
          id: input?.id,
        },
        include: {
          collection: {
            include: {
              nftSets: true
            }
          },
          nftEditions: {
            include: {
              owner: {
                include: {
                  user: true
                }
              }
            }  
          },
          properties: true,
          history: {
            orderBy: {
              createdAt: 'desc'
            }
          } 
        },
      });

      const nftSetWithViewCount = computeViewLikeCount(
        nftSet as DetailedNFTSet, 
        true  
      );

      return nftSetWithViewCount;
  }),
  getInfiniteNftSets: t.procedure
    .input(
      z.object({
        collectionId: z.string().nullish(),
        filters: z.record(z.array(z.string())).optional(),
        names: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      let andClauses = Array(0);

      const { filters, names } = input || {};

      if (filters) {
        andClauses = Object.keys(filters).reduce((prev, groupKey) => {

          if (!filters[groupKey] || !filters[groupKey]?.length) {
            return [...prev]
          }          

          return [
            ...prev,
            { properties: { some: { OR: filters[groupKey]?.map(id => ({ id }))}}}
          ]
        }, Array());
      }

      if (names) {
        names.forEach((name, idx) => {
          andClauses.push({
            name: {
              contains: name
            }
          })
        });
      }

      const items = await ctx.prisma.nFTSet.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          AND: andClauses,
          collectionId: input.collectionId
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
  }),
  getFavorites: authedProcedure
    .query(async({ ctx }) => {

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user?.id
        }
      });
    
      let favorites;
    
      if (user) {
    
        favorites = await ctx.prisma.nFTSet.findMany({
          where: {
            id: {
              in: user.liked
            }
          }
        });
      }

      return favorites;
   }),
  like: authedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => { 

      let nftSet = await ctx.prisma.nFTSet.findFirst({
        where: {
          id: input.id
        }
      });
    
      if (!nftSet?.likes.find(userId => ctx.session.user?.id === userId)) {
        nftSet = await ctx.prisma.nFTSet.update({
          where: {
            id: input.id,
          },
          data: {
            likes: {
              push: ctx.session.user.id
            }
          },
          include: {
            collection: true,
            nftEditions: {
              include: {
                owner: {
                  include: {
                    user: true
                  }
                }
              }
            },
            properties: true,
            history: {
              orderBy: {
                createdAt: 'desc'
              }
            } 
          },
        });

        const nftSetId = nftSet.id;

        if (ctx.session.user) {
          const user = await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id
            }
          });

          if (user) {
            const userLikes = user?.liked.find(nftId =>  nftId === nftSetId)

            if (!userLikes) {
              await ctx.prisma.user.update({
                where: {
                  id: ctx.session.user.id
                },
                data: {
                  liked: {
                    push: nftSetId
                  }
                }
              })
            }
          }
        }
      }
      
      const nftSetWithViewCount = computeViewLikeCount(
        nftSet as DetailedNFTSet, 
        true  
      );

      return nftSetWithViewCount;

    }),
  unLike: authedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => { 

      let nftSet = await ctx.prisma.nFTSet.findFirst({
        where: {
          id: input.id
        }
      });
    
      if (nftSet && nftSet?.likes.find(userId => ctx.session.user?.id === userId)) {
        const updatedLikes = nftSet.likes.filter(userId => ctx.session.user?.id !== userId) 

        nftSet = await ctx.prisma.nFTSet.update({
          where: {
            id: input.id,
          },
          data: {
            likes: updatedLikes
          },
          include: {
            collection: true,
            nftEditions: {
              include: {
                owner: {
                  include: {
                    user: true
                  }
                }
              }
            },
            properties: true,
            history: {
              orderBy: {
                createdAt: 'desc'
              }
            } 
          },
        });

        const nftSetId = nftSet.id;

        if (ctx.session.user) {
          const user = await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id
            }
          });

          if (user) {
            const userLikes = user?.liked.filter(nftId =>  nftId !== nftSetId)
            await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id
              },
              data: {
                liked: userLikes
              }
            });
          }
        }
      }
      
      const nftSetWithViewCount = computeViewLikeCount(
        nftSet as DetailedNFTSet, 
        true  
      );

      return nftSetWithViewCount;

    }),
  create: authedProcedure
    .input(
      z.object({ 
        name: z.string(),
        description: z.string().optional(),
        link: z.string().optional(),
        collectionId: z.string().optional(),
        totalSupply: z.number(),
        creator: z.string(),
        file: z.string(),
        properties: z.array(z.object({
          type: z.string(),
          name: z.string()
        })).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const authenticatedUserId = ctx.session?.user?.id;

      if (!input.file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file present.",
        });
      }

      let creatorWallet = await ctx.prisma.wallet.findFirst({
        where: {
          virtual: true,
          userId: authenticatedUserId,
        }
      })

      if (!creatorWallet) {
        creatorWallet = await ctx.prisma.wallet.create({
          data: {
            virtual: true,
            userId: authenticatedUserId
          }
        })
      }

      if (!creatorWallet) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No wallet located for creator.",
        });
      } 


      const base64 = Buffer.from(
        input.file.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const blob = new Blob([base64]);
      const imageCid = await client.storeBlob(blob);

      let collectionId;
      if (input.collectionId) {
        collectionId = input.collectionId;
      } else {

        const count = await ctx.prisma.collection.count() || 0;

        const newCollection = await ctx.prisma.collection.create({
          data: {
            logoImageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
            name: `Untitled Collection #${count +1}`,
            description: 'Welcome to the home of Untitled Collection on Mage. Discover the best items in this collection.',
            userId: authenticatedUserId
          }
        });

        collectionId = newCollection.id;
      }

      const validCollectionCheck = await ctx.prisma.collection.findFirst({
        where: {
          id: collectionId,
          userId: authenticatedUserId
        }
      })

      if (!validCollectionCheck) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid collection.",
        });
      }

      const nftEditionObjArray = Array();
      for (let index = 0; index < input.totalSupply; index++) {
        nftEditionObjArray.push(
          {
            ownerId: creatorWallet.id,
            minted: false,
          }
        );    
      }

      const nftSet = await ctx.prisma.nFTSet.create({
        data: {
          creatorId: authenticatedUserId,
          name: input.name,
          description: input.description,
          blockchainId: "Ethereum",
          imageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
          link: input.link,
          collectionId,
          nftEditions: {
            create: nftEditionObjArray
          },
          properties: {
            create: input.properties
          },
          history: {
            create: {
              currency: "Eth",
              eventType: "Minted",
              price: 0,
              quantity: input.totalSupply,
              fromAdminWallet: true,
              walletToId: creatorWallet.id,
            }
          }
        }
      });

      return nftSet;
    }),
});
