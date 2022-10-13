import { DateAsMonthYearAsWords } from "../../../utils/date";
import Image from "../../forms/controls/Image";
import NftSetSummary from "../nfts/nftSetSummary";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { DropDown, DropDownItem } from "../../forms/controls/DropDown";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Collection = inferProcedureOutput<AppRouter["collection"]["get"]>;

type CollectionHeaderProps = {
  bannerImageUrl?: string | undefined | null;
  collectionId: string | undefined;
  isLoading: boolean;
  logoImageUrl?: string;
  owner: string | undefined;
};

const CollectionHeader = ({
  bannerImageUrl,
  collectionId,
  isLoading,
  logoImageUrl,
  owner,
}: CollectionHeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex-col w-full h-full mb-14 md:mb-24">
      {logoImageUrl && !isLoading ? (
        <div className="h-48 md:h-96 w-full relative">
          <Image
            src={bannerImageUrl || logoImageUrl}
            alt="image"
            objectFit="cover"
            layout="fill"
            placeholder="blur"
            blurDataURL="/images/AwaitingImage1400x350.png"
            fallbackImage="/images/AwaitingImage1400x350.png"
          />
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-20 rounded-lg shadow-md p-0.5 md:p-1">
            <div className="w-full h-full p-1 relative rounded-xl">
              <Image
                className="rounded-lg"
                src={logoImageUrl}
                alt="image"
                objectFit="cover"
                layout="fill"
                placeholder="empty"
                blurDataURL="/images/AwaitingImage600x400.png"
                fallbackImage="/images/AwaitingImage600x400.png"
              />
            </div>
          </div>
          {(session && session.user?.id === owner) &&
            <div className="absolute right-16 -bottom-10 md:-bottom-16">
              <DropDown
                icon={<FaEllipsisH size={25} className="fill-gray-700 dark:fill-gray-300"/>}
                position="left"
              >
                <DropDownItem 
                  icon={<FaPlus size={20} className="fill-gray-700 dark:fill-gray-300"/>}
                  caption="Add Item" 
                  onClick={() => router.push(`/nfts/create?collectionId=${collectionId}`)}
                />
              </DropDown>
            </div>
          }
        </div>
      ) : (
        <div className="h-48 md:h-96 w-full relative">
          <div className="flex w-full h-full empty:bg-gray-100" />
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-20 rounded-lg p-1 md:p-2 shadow-md">
            <div className="w-full h-full bg-gray-100 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

type ComponentProps = {
  collection: Collection | undefined;
};

const CollectionDetail = ({ collection }: ComponentProps) => {
  const {
    bannerImageUrl,
    logoImageUrl,
    name,
    nftSets,
    createdAt,
    description,
  } = collection
    ? collection
    : {
        name: "",
        bannerImageUrl: "",
        logoImageUrl: "",
        nftSets: [],
        createdAt: undefined,
        description: "",
      };

  function pluralize(word: string, value: number): string {
    const plural = value && (value > 0 || value === 0) ? "" : "s";
    return `${word}${plural}`;
  }

  return (
    <section className="flex flex-col gap-y-5 w-full text-lg font-normal dark:text-gray-300 text-gray-700">
      <CollectionHeader
        bannerImageUrl={bannerImageUrl}
        collectionId={collection?.id}
        isLoading={collection ? false : true}
        logoImageUrl={logoImageUrl}
        owner={collection?.userId}
      />
      <section>
        <section className="flex flex-col mb-10 px-10">
          <div className="text-2xl md:text-3xl font-semibold">{name}</div>
          <div className="flex gap-3 font-gray-500 my-5">
            <div className="flex gap-2">
              <div className="">{`${pluralize("Item", nftSets.length)}`}</div>
              <div className="font-bold">{`${nftSets.length}`}</div>
            </div>
            <div className="">-</div>
            {createdAt && (
              <div className="flex gap-2">
                <div className="">Created</div>
                <div className="font-bold">{`${DateAsMonthYearAsWords(
                  createdAt
                )}`}</div>
              </div>
            )}
          </div>
          <div>
            {description ||
              `Welcome to the home of ${name} on Mage. Discover the best items in this collection.`}
          </div>
        </section>
        <section className="flex flex-col w-full p-2 md:p-10">
          <div className="w-fit border-b-2 border-gray-700 pb-3 font-medium">
            Items
          </div>
          <hr className="border border-gray-200" />
          <div className="p-3 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {collection?.nftSets.map((nftSet) => (
              <div key={nftSet.id}>
                <NftSetSummary nftSet={nftSet} />
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
};

export default CollectionDetail;
