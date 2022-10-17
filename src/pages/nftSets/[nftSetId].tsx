import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import NftSetDetail from "../../components/views/nfts/nftSetDetail";
import { prisma } from "../../server/db/client";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { computeViewLikeCount, DetailedNFTSet, NFTSetWithMeta } from "../../utils/computed-properties";
import { useState } from "react";

const NftSetDetailPage = ({ nftSet }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [nft, setNft] = useState<NFTSetWithMeta>(nftSet);

  const likeMutation = trpc.nftSet.like.useMutation({
    onSuccess(nft) {
      setNft(nft);
    }
  });

  const unLikeMutation = trpc.nftSet.unLike.useMutation({
    onSuccess(nft) {
      setNft(nft);
    }
  });

  const handleLikeNft = async () => {
    await likeMutation.mutateAsync({
      id: nftSet.id,
    });
  }

  const handleUnLikeNft = async () => {
    await unLikeMutation.mutateAsync({
      id: nftSet.id,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-310px)]">
      <NftSetDetail nftSet={nft} onLike={handleLikeNft} onUnLike={handleUnLikeNft}/>
    </div>
  );
};

type NftPageProps = {
  nftSet: NFTSetWithMeta
}

export const getServerSideProps: GetServerSideProps<NftPageProps> = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);
  const authenticatedUserId = session?.user?.id || '';

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

  if (session?.user?.id && !nftSet?.views.find(userId => authenticatedUserId === userId)) {
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

  const nftSetWithViewCount = computeViewLikeCount(
    nftSet as DetailedNFTSet, 
    nftSet?.likes.find(userId => authenticatedUserId === userId) ? true : false  
  );

  return {
    props: {
      nftSet: nftSetWithViewCount
    },
  };
};

export default NftSetDetailPage;
