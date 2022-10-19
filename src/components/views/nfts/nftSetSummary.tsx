import React from "react";
import Link from "next/link";
import Image from "../../forms/controls/Image";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { MdVerified } from "react-icons/md";
import { CollectionWithNftSets } from "../../../utils/computed-properties";

type NftSet = inferProcedureOutput<AppRouter["nftSet"]["getLean"]>;

const NftSetSummary = React.forwardRef<HTMLDivElement, { nftSet: NftSet, collection: CollectionWithNftSets | null }>(
  (props: { nftSet: NftSet, collection: CollectionWithNftSets | null }, ref) => {
    const { nftSet, collection } = props;
    if (!nftSet) return <div>Loading...</div>;

    return (
      <Link href={`/nftSets/${nftSet.id}`}>
        <div
          ref={ref}
          className="flex flex-col h-[226px] md:h-[457px] hover:shadow-lg shadow-md  hover:shadow-gray-500/50 dark:border dark:border-gray-600 cursor-pointer rounded-2xl"
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-t-2xl h-full">
            <Image
              src={nftSet.imageUrl}
              alt={nftSet.name}
              height={500}
              width={500}
              className="rounded-t-2xl transition transform-gpu hover:scale-125"
            />
          </div>
          <div className="p-2 md:p-4 rounded-b-2xl">
            <div className="text-sm md:text-lg text-ellipsis overflow-hidden whitespace-nowrap">{nftSet.name}</div>
            <div>
              {collection && 
                <div className="flex items-center gap-2">
                  <div className="text-xs md:text-sm font-light my-3 text-ellipsis overflow-hidden whitespace-nowrap">
                    {collection.name}
                  </div>
                  {collection.verified && 
                    <span className="verified_icon">
                        <MdVerified size={20}/>
                        <div className="verified_icon_bg">
                          <MdVerified size={20} className=""/>
                        </div>
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

NftSetSummary.displayName = "NftSetSummary";

export default NftSetSummary;
