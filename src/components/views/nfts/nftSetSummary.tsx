import React from "react";
import Link from "next/link";
import Image from "../../forms/controls/Image";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";

type NftSet = inferProcedureOutput<AppRouter["nftSet"]["getLean"]>;

const NftSetSummary = React.forwardRef<HTMLDivElement, { nftSet: NftSet }>(
  (props: { nftSet: NftSet }, ref) => {
    const { nftSet } = props;
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
            <div className="text-sm md:text-md text-ellipsis overflow-hidden whitespace-nowrap">{nftSet.name}</div>
          </div>
        </div>
      </Link>
    );
  }
);

NftSetSummary.displayName = "NftSetSummary";

export default NftSetSummary;
