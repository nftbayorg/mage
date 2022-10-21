import Image from "../../forms/controls/Image";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { DropDown, DropDownItem } from "../../forms/controls/DropDown";
import { FaEllipsisH, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type CollectionHeaderProps = {
  bannerImageUrl?: string | undefined | null;
  collectionId: string | undefined;
  isLoading: boolean;
  logoImageUrl?: string;
  owner: string | undefined;
};

export const CollectionHeader = ({
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
                icon={<FaEllipsisH size={25} className="fill-gray-700 dark:fill-gray-200"/>}
                position="left"
              >
                <DropDownItem 
                  icon={<FaPlus size={20} className="fill-gray-700 dark:fill-gray-200"/>}
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
