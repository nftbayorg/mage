import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import NftSetDetail from "../../components/views/nfts/nftSetDetail";
import { prisma } from "../../server/db/client";
import { Collection, NFTEdition, NFTSet, NFTSetProperties, User, Wallet } from "prisma/prisma-client";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: Collection | null;
  properties: NFTSetProperties[];
}

function computeViewCount<NFTSet extends NftSetViews>(
  nftSet: NFTSet
): NftSetWithViewCount<Omit<NFTSet, 'views'>> {
  const { views, ...rest } = nftSet;

  return {
    ...rest,
    viewCount: views.length,
  }
}

const NftSetDetailPage: NextPage = ({ nftSet }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-310px)]">
      <NftSetDetail nftSet={nftSet} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  let nftSet = await prisma.nFTSet.findFirst({
    where: {
      id: ctx.params?.nftSetId as string || '',
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
      properties: true
    },
  });

  if (session?.user?.id && !nftSet?.views.find(userId => session.user?.id === userId)) {
    nftSet = await prisma.nFTSet.update({
      where: {
        id: ctx.params?.nftSetId as string || '',
      },
      data: {
        views: {
          push: session.user.id
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
        properties: true
      },
    });
  }

  const nftSetWithViewCount = computeViewCount(nftSet as DetailedNFTSet);

  return {
    props: {
      nftSet: nftSetWithViewCount
    },
  };
};

export default NftSetDetailPage;
