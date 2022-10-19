import { DateAsMonthYearAsWords } from "../../../utils/date";
import Image from "../../forms/controls/Image";
import NftSetSummary from "../nfts/nftSetSummary";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { DropDown, DropDownItem } from "../../forms/controls/DropDown";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { MdVerified } from "react-icons/md";

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
    <div className="flex-col w-full h-full mb-14 md:mt-3 md:mb-24">
      {logoImageUrl && !isLoading ? (
        <div className="h-48 md:h-96 w-full relative">
          <Image
            src={bannerImageUrl || logoImageUrl}
            alt="image"
            className="w-full overflow-hidden object-contain"
          />
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white dark:bg-slate-800 absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-20 rounded-lg shadow-md p-0.5 md:p-1">
            <div className="w-full h-full p-1 relative rounded-xl">
              <Image
                className="rounded-lg"
                src={logoImageUrl}
                alt="image"
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
          <div className="flex w-full h-full empty:bg-gray-100 animate-pulse" />
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-20 rounded-lg p-1 md:p-2 shadow-md">
            <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
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
    verified
  } = collection
    ? collection
    : {
        name: "",
        bannerImageUrl: "",
        logoImageUrl: "",
        nftSets: [],
        createdAt: undefined,
        description: "",
        verified: false
      };

  function pluralize(word: string, value: number): string {
    const plural = value && (value > 0 || value === 0) ? "s" : "";
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
      <section className="px-4 md:px-0">
        <section className="flex flex-col mb-10 md:px-10">
          <div className="flex items-center gap-2">
            <div className="text-2xl md:text-3xl font-semibold">
              {name}
            </div>
            {verified && 
              <span className="verified_icon">
                  <MdVerified size={20}/>
                  <div className="verified_icon_bg">
                    <MdVerified size={20} className=""/>
                  </div>
              </span>
            }
          </div>

          <div className="flex gap-3 font-gray-500 my-5">
            <div className="flex gap-2">
              <div className="font-bold">{`${nftSets.length}`}</div>
              <div className="">{`${pluralize("Item", nftSets.length)}`}</div>
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
        <section className="flex flex-col w-full md:p-10">
          <div className="w-fit border-b-2 border-gray-700 pb-3 font-medium">
            Items
          </div>
          <hr className="border border-gray-200" />
          <div className="py-4 md:mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
            {collection?.nftSets.map((nftSet) => (
              <div key={nftSet.id}>
                <NftSetSummary nftSet={nftSet} collectionName={collection.name} verified={collection.verified}/>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
};

export default CollectionDetail;
