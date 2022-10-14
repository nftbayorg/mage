import { DateAsWord } from "../../../utils/date";
import {
  FaEye,
  FaChartLine,
  FaEthereum,
  FaRegHeart,
  FaTag,
  FaTags,
  FaAlignLeft,
  FaListUl,
} from "react-icons/fa";
import Link from "next/link";
import Image from "../../forms/controls/Image";
import { CollapsePanel } from "../../forms/controls/CollapsePanel";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { NFTSet, NFTEdition, Wallet, NFTSetProperties } from "prisma/prisma-client";
import { ToolTip } from "../../forms/controls/Tooltip";

type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: Collection | null;
  properties: NFTSetProperties[];
}


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
  nftSet: NftSetWithViewCount<DetailedNFTSet> | undefined;
};

const NftSetDetail = ({ nftSet }: ComponentProps) => {

  if (!nftSet) {
    return <NftSetDetailSkeleton />;
  }

  const owner = nftSet.nftEditions[0]?.owner?.userId;

  return (
    <section className="flex flex-col w-full space-y-4 lg:flex-row lg:gap-x-6 lg:w-5/6 p-5 md:m-10 pt-0 border-gray-200 dark:border-gray-600">
      <div className="lg:hidden">
        <NftSetHeader
          collection={nftSet.collection as Collection}
          name={nftSet.name}
          owner={owner || ''}
          views={nftSet.viewCount}
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
            <button className="ml-auto hover:text-red-500  dark:hover:text-red-500">
              <ToolTip
                label="Favorite"
                position="top"
              >
                <FaRegHeart size={20} className="fill-gray-400 mr-2 hover:fill-red-500" />
              </ToolTip>
            </button>
          </div>
          <div className="flex items-center justify-center cursor-pointer w-full h-[400px] md:h-[578px] relative rounded-b-xl border border-gray-200 dark:border-gray-600 border-t-0 rounded-xl rounded-t-none">
            <Image
              src={nftSet.imageUrl}
              alt={nftSet.name}
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
              By <div className="font-bold">{nftSet.creatorId}</div>
            </div>
            {nftSet.collection?.description && (
              <div className="text-md text-gray-700 dark:text-gray-200">
                {nftSet.description || nftSet.collection?.description}
              </div>
            )}
          </div>
        </CollapsePanel>

        <CollapsePanel
          label="Properties"
          icon={
            <FaTags
              size={25}
              className="fill-gray-700 dark:fill-gray-400 rotate-90"
            />
          }
          collapsible={true}
        >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 flex-wrap">
          {nftSet.properties && nftSet.properties.map((property, idx) => (
            <div className="border border-blue-300 bg-blue-50 w-full md:w-full h-24 flex flex-col items-center justify-center gap-1 rounded-lg relative" key={idx}>
              <div className="text-blue-400 text-md">{property.type}</div>
              <div className="text-gray-700">{property.name}</div>
            </div>
          ))}
        </div>
        </CollapsePanel>

        {nftSet.description && 
          <CollapsePanel
            label={`About ${nftSet.collection?.name}`}
            icon={
              <FaTags
                size={25}
                className="fill-gray-700 dark:fill-gray-400 rotate-90"
              />
            }
            collapsible={true}
          >
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="flex gap-2 w-full h-full text-md text-gray-700 dark:text-gray-200">
                {nftSet.collection?.description}
              </div>
            </div>
          </CollapsePanel>
        }    
      </div>

      <section className="lg:w-3/5 flex flex-col gap-5">
        <div className="hidden lg:block">
          <NftSetHeader
            collection={nftSet.collection as Collection}
            name={nftSet.name}
            owner={owner || ''}
            views={nftSet.viewCount}
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
          <div className="flex-col space-y-3"></div>
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
            <div className="text-gray-700 dark:text-gray-200 text-xl">
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
            <div className="text-gray-700 dark:text-gray-200 text-xl">
              No offers yet
            </div>
          </div>
        </CollapsePanel>
      </section>
    </section>
  );
};

export default NftSetDetail;
