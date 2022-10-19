import {
  FaEye,
  FaChartLine,
  FaEthereum,
  FaRegHeart,
  FaTag,
  FaTags,
  FaAlignLeft,
  FaListUl,
  FaStream,
  FaHeart,
  FaTh,
  FaRegClock,
} from "react-icons/fa";
import Link from "next/link";
import Image from "../../forms/controls/Image";
import { CollapsePanel } from "../../forms/controls/CollapsePanel";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { useSession } from "next-auth/react";
import { ToolTip } from "../../forms/controls/Tooltip";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { NFTSetWithMeta } from "../../../utils/computed-properties";
import { NftSetHistory } from "./nftSetHistory";
import { NFTSetProperties } from "prisma/prisma-client";
import NftSetSummary from "./nftSetSummary";
import { number } from "zod";

type Collection = inferProcedureOutput<AppRouter["collection"]["get"]>;

const NftSetDetailSkeleton = () => (
  <section className="flex flex-col w-full space-y-4 lg:flex-row lg:gap-x-6 lg:w-5/6 p-5 md:m-10 pt-0 border-gray-200 dark:border-gray-600 ">
    <div className="lg:hidden">
      <div className="flex flex-col gap-12 mt-4 mb-10">
        <div className="text-4xl w-2/4 h-7 bg-blue-200 animate-pulse rounded-lg" />
        <div className="text-4xl w-2/4 h-7 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>

    <div className="flex flex-col lg:w-2/5 space-y-4">
      <section className="">
        <div className="flex p-3 dark:border-gray-600 border border-gray-200 border-b-0 rounded-xl rounded-b-none">
          <button
            className="flex items-center hover:text-blue-500 dark:hover:text-blue-500 text-xl text-gray-700 dark:text-gray-300"
            disabled
          >
            <FaEthereum className="fill-blue-500 mr-2" size={20} />
            Buy now
          </button>
          <button
            className="ml-auto hover:text-red-500  dark:hover:text-red-500"
            disabled
          >
            <FaRegHeart size={20} className="fill-gray-400 mr-2" />
          </button>
        </div>
        <div className="w-full h-[400px] md:h-[578px] rounded-b-xl bg-gray-200 dark:bg-gray-400 border-t-0 rounded-xl rounded-t-none animate-pulse" />
      </section>

      <CollapsePanel
        label="Description"
        icon={
          <FaAlignLeft size={25} className="fill-gray-700 dark:fill-gray-400" />
        }
        collapsible={true}
        defaultState="collapsed"
      />

      <CollapsePanel
        label="Properties"
        icon={
          <FaTags
            size={25}
            className="fill-gray-700 dark:fill-gray-400 rotate-90"
          />
        }
        collapsible={true}
        defaultState="collapsed"
      />
    </div>

    <section className="lg:w-3/5 flex flex-col gap-5">
      <div className="hidden lg:block">
        <div className="flex flex-col gap-12 mt-4 mb-10">
          <div className="text-4xl w-2/4 h-7 bg-blue-200 animate-pulse rounded-lg" />
          <div className="text-4xl w-2/4 h-7 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>

      <CollapsePanel
        icon={
          <FaChartLine
            size={25}
            className="fill-gray-700 dark:fill-gray-400 font-light"
          />
        }
        label="Price History"
        collapsible={true}
        defaultState="collapsed"
      />

      <CollapsePanel
        label="Listings"
        icon={<FaTag size={25} className="fill-gray-700 dark:fill-gray-400" />}
        collapsible={true}
        defaultState="collapsed"
      />

      <CollapsePanel
        label="Offers"
        icon={
          <FaListUl size={25} className="fill-gray-700 dark:fill-gray-400" />
        }
        collapsible={true}
        defaultState="collapsed"
      />
    </section>
  </section>
);

const NftSetHeader = ({
  collection,
  name,
  owner,
  views
}: {
  collection: Collection;
  name: string;
  owner: string;
  views: number;
}) => {
  const { data: session } = useSession();

  return (
  <>
    {collection && (
      <div className="flex-col gap-y-6 w-full mt-5 md:mt-0">
        <Link href={`/collections/${collection?.id}`}>
          <div className="text-xl font-light text-blue-500 my-3 cursor-pointer">
            {collection.name}
          </div>
        </Link>
        <div className="text-4xl font-semibold py-5 text-gray-700 dark:text-gray-400">
          {name}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center md:gap-10">
          <div className="flex items-center gap-2">
            <div className="text-lg text-gray-600 dark:text-gray-400">Owned By</div>
            <Link href={`/${owner}`}>
              <div className="text-lg text-blue-500 my-3 cursor-pointer truncate max-w-[140px] md:max-w-fit">
                {owner === session?.user?.id && "You"}
                {owner !== session?.user?.id && owner}
              </div>
            </Link>
          </div>
          <div className="flex gap-x-2 items-center">
            <FaEye className="fill-gray-700 dark:fill-gray-400" size={20} />
            <div className="text-1xl text-gray-700 dark:text-gray-400">
              {views}
            </div>
          </div>

        </div>
      </div>
    )}
  </>);
}

type ComponentProps = {
  nftSet: NFTSetWithMeta | undefined;
  collectionProperties: collectionProperties;
  onLike: () => void;
  onUnLike: () => void;
};

const NftSetDetail = ({ collectionProperties, nftSet, onLike, onUnLike }: ComponentProps) => {

  const [nft, setNft] = useState(nftSet);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setNft(nftSet);
  }, [nftSet])

  const calcTraitPercentage = useCallback((property: NFTSetProperties) => {
    const { nftSetsInCollection, propertyCounts } = collectionProperties;

    if (!nftSetsInCollection || !propertyCounts) return 0;

    const countedProperty = propertyCounts.find(p => p.name === property.name && p.type === property.type);

    if (!countedProperty) return 0;

    return (countedProperty._count.name / nftSetsInCollection * 100).toFixed(0);
  }, [collectionProperties])

  if (!nft) {
    return <NftSetDetailSkeleton />;
  }

  const owner = nft.nftEditions[0]?.owner?.userId;

  const handleLike = () => {
    if (!session?.user) {
      router.push('/login');
    } else {
      setNft(prev => {
        if (prev) {
          if (prev.liked) {
            onUnLike();
            return {...prev, likeCount: prev?.likeCount-1, liked: false}
          } else {
            onLike();
            return {...prev, likeCount: prev?.likeCount+1, liked: true}
          }
        }
      });
    }
  }


  return (
    <section className="flex flex-col w-full gap-y-4 lg:w-5/6 p-2 md:p-10">
      <section className="flex flex-col w-full gap-y-4 lg:flex-row lg:gap-x-6">
        <div className="lg:hidden">
          <NftSetHeader
            collection={nft.collection as Collection}
            name={nft.name}
            owner={owner || ''}
            views={nft.viewCount}
          />
        </div>

        <div className="flex flex-col lg:w-2/5 space-y-4">
          <section className="">
            <div className="flex p-3 dark:border-gray-600 border border-gray-200 border-b-0 rounded-xl rounded-b-none">
              <ToolTip
                label="Blockchain: Ethereum"
                position="top"
              >
                <FaEthereum className="fill-blue-500 mr-2" size={20} />
              </ToolTip>

              <div className="ml-auto flex justify-end gap-3">
                <div className="dark:text-gray-400">{nft.likeCount}</div>

                <button 
                  onClick={handleLike}
                >
                  <ToolTip
                    label="Favorite"
                    position="top"
                  >
                    <>
                      {!nft.liked && <FaRegHeart size={20} className="fill-gray-400 mr-2 hover:fill-red-500" />} 
                      {nft.liked && <FaHeart size={20} className="fill-red-500 mr-2" />}
                    </>
                  </ToolTip>
                </button>
              </div>
            </div>
            <div className="cursor-pointer w-full h-[400px] md:h-[578px] relative rounded-b-xl border border-gray-200 dark:border-gray-600 border-t-0 rounded-xl rounded-t-none overflow-hidden">
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                layout="intrinsic"
                priority={true}
                width="800"
                height="800"
                objectFit="contain"
                className="rounded-b-xl"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg=="
              />
            </div>
          </section>

          <CollapsePanel
            label="Description"
            icon={
              <FaAlignLeft
                size={25}
                className="fill-gray-700 dark:fill-gray-400"
              />
            }
          >
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="flex gap-2 w-full h-full text-md text-gray-700 dark:text-gray-200">
                By <div className="font-bold">{nft.creatorId}</div>
              </div>
              {nft.collection?.description && (
                <div className="font-light text-md text-gray-700 dark:text-gray-200">
                  {nft.description || nft.collection?.description}
                </div>
              )}
            </div>
          </CollapsePanel>

          <CollapsePanel
            label="Properties"
            classesOverride="p-6 md:p-1"
            icon={
              <FaTags
                size={25}
                className="fill-gray-700 dark:fill-gray-400 rotate-90"
              />
            }
            collapsible={true}
          >
          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 flex-wrap">
            {nft.properties && nft.properties.map((property, idx) => (
              <div className="border border-blue-300 bg-blue-50 dark:bg-gray-700 w-full md:w-full h-24 flex flex-col items-center justify-center gap-1 rounded-lg relative overflow-hidden" key={idx}>
                <div className="text-blue-400 text-xs w-full text-ellipsis whitespace-nowrap text-center px-1 overflow-hidden">{property.type}</div>
                <div className="text-gray-700 dark:text-gray-200 text-md w-full text-ellipsis overflow-hidden whitespace-nowrap text-center px-1">{property.name}</div>
                <div className="text-gray-700 dark:text-gray-400 md:text-sm text-ellipsis w-full whitespace-nowrap overflow-hidden text-center px-1">{`${calcTraitPercentage(property)}% have this trait`}</div>
              </div>
            ))}
          </div>
          </CollapsePanel>

          <CollapsePanel
            label={`About ${nft.collection?.name}`}
            icon={
              <FaStream
                size={25}
                className="fill-gray-700 dark:fill-gray-400"
              />
            }
            collapsible={true}
            defaultState="collapsed"
          >
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="flex gap-2 w-full h-full text-md text-gray-700 dark:text-gray-200">
                {nft.collection?.description}
              </div>
            </div>
          </CollapsePanel>
        </div>

        <section className="lg:w-3/5 flex flex-col gap-5">
          <div className="hidden lg:block">
            <NftSetHeader
              collection={nft.collection as Collection}
              name={nft.name}
              owner={owner || ''}
              views={nft.viewCount}
            />
          </div>

          <CollapsePanel
            icon={
              <FaChartLine
                size={25}
                className="fill-gray-700 dark:fill-gray-400 font-light"
              />
            }
            label="Price History"
            collapsible={true}
            defaultState="collapsed"
          >
            <div className="flex flex-col space-y-3 items-center justify-center w-full">
              <FaRegClock size={25} className="fill-gray-700 dark:fill-gray-400 font-light"/>
              <div className="font-medium">No data yet</div>
              <div>Check back later.</div>
            </div>
          </CollapsePanel>

          <CollapsePanel
            label="Listings"
            icon={
              <FaTag size={25} className="fill-gray-700 dark:fill-gray-400" />
            }
            collapsible={true}
          >
            <div className="flex flex-col justify-center items-center space-y-3 ">
              <Image
                src="/images/empty.png"
                alt="Empty listings"
                width="150"
                height="100"
                objectFit="cover"
                className="rounded-xl w-[150px] h-[100px]"
                hideLoadingIndicator={true}
              />
              <div className="text-gray-700 dark:text-gray-200 text-xl font-light">
                No listings yet
              </div>
            </div>
          </CollapsePanel>

          <CollapsePanel
            label="Offers"
            icon={
              <FaListUl size={25} className="fill-gray-700 dark:fill-gray-400" />
            }
            collapsible={true}
          >
            <div className="flex flex-col justify-center items-center space-y-3 ">
              <Image
                src="/images/empty.png"
                alt="Empty listings"
                width="150"
                height="100"
                objectFit="cover"
                className="rounded-xl w-[150px] h-[100px]"
                hideLoadingIndicator={true}
              />
              <div className="text-gray-700 dark:text-gray-200 text-xl font-light">
                No offers yet
              </div>
            </div>
          </CollapsePanel>
        </section>
      </section>
      <section className="">
        {nftSet && <NftSetHistory history={nftSet?.history} />}
      </section>
      <section>
        <CollapsePanel
          label="More From This Collection"
          icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-400"/>}
          classesOverride="px-1 md:px-1"
          collapsible={true}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
            {nftSet?.collection?.nftSets && nftSet?.collection?.nftSets.filter(n => n.id !== nftSet.id).map(nft => (
              <NftSetSummary key={nft.id} nftSet={nft} />
            ))}
          </div>
          {nftSet?.collection?.nftSets && 
            <div className="flex w-full items-center justify-center border-t dark:border-gray-600 pt-2 mt-2">
              <Link href={`/collections/${nftSet.collection.id}`}>
                <a
                  className="
                  md:max-w-fit 
                  flex items-center justify-center 
                  dark:text-gray-300 py-4 px-10 hover:bg-blue-400 bg-blue-500 disabled:bg-blue-200 text-white
                  dark:border
                  dark:border-gray-300
                  dark:bg-white dark:bg-opacity-0
                  dark:hover:bg-opacity-10
                  rounded
                  font-semibold 
                "
                >
                  View collection
                </a>
              </Link>
            </div>
          }
        </CollapsePanel>
      </section>
    </section>
  );
};

export default NftSetDetail;
