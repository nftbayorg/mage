import Image from "../../forms/controls/Image";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { DropDown, DropDownItem } from "../../forms/controls/DropDown";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { DateAsMonthYearAsWords } from "../../../utils/date";
import { pluralize } from "../../../utils/strings";
import Label from "../../forms/controls/Label";
import { VerifiedBadge } from "../../icons/VerifiedBadge";
import { useCallback } from "react";
import { useCollectionStore } from "../../../hooks/useCollectionProperties";

type CollectionHeaderProps = {
  floorPrice: number;
  isLoading: boolean;
};

export const CollectionHeader = ({
  floorPrice,
  isLoading,
}: CollectionHeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const collection = useCollectionStore(useCallback((state) => state.collection, []));

  const {
    id,
    bannerImageUrl,
    logoImageUrl,
    name,
    nftSets,
    createdAt,
    description,
    verified,
    userId
  } = collection;

  return (
    <div className="flex-col w-full h-full md:mt-3">
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
          {(session && session.user?.id === userId) &&
            <div className="absolute right-16 -bottom-10 md:-bottom-16">
              <DropDown
                icon={<FaEllipsisH size={25} className="fill-gray-700 dark:fill-gray-200"/>}
                position="left"
              >
                <DropDownItem 
                  icon={<FaPlus size={20} className="fill-gray-700 dark:fill-gray-200"/>}
                  caption="Add Item" 
                  onClick={() => router.push(`/nfts/create?collectionId=${id}`)}
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
      <section className="px-4 md:px-0 mt-14 md:mt-28">
        <section className="flex flex-col md:mb-10 md:px-10">
          <div className="flex items-center gap-2">
            <div className="text-2xl md:text-3xl font-semibold">
              {name}
            </div>
            {verified && <VerifiedBadge/>}
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
            <Label
              caption= {description || `Welcome to the home of ${name} on Mage. Discover the best items in this collection.`}
              collapsible={true}
              defaultState="collapsed"
            />
          </div>
          <section className="hidden md:flex pt-5">
            <div className="flex flex-col">
              <div>{floorPrice} ETH</div>
              <div>Floor price</div>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
};
