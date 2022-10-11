import React from "react";
import Link from "next/link";
import { timeRemaining } from "../../../utils/time";
import Image from "../../forms/controls/Image";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";

type Lot = inferProcedureOutput<
  AppRouter["auction"]["getInfiniteAuctions"]
>["items"][0]["lots"][0];

const LotSummary = React.forwardRef<HTMLDivElement, { lot: Lot }>(
  (props: { lot: Lot }, ref) => {
    const { lot } = props;
    if (!lot) return <div>Loading...</div>;

    return (
      <Link href={`/lots/${lot.id}`}>
        <div
          ref={ref}
          className="flex-col hover:shadow-lg hover:shadow-gray-500/50 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src={lot.nftEdition.nftSet.imageUrl}
              alt={lot.nftEdition.nftSet.name}
              height={500}
              width={500}
              objectFit="contain"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 p-4">
            <div className="text-md">{lot.nftEdition.nftSet.name}</div>
            <div className="mt-1 text-sm text-yellow-500">
              {lot.nftEdition.nftSet.collection?.name}
            </div>
            <div className="mt-1 text-sm text-yellow-500">
              Ends in {timeRemaining(lot.auction.end)}
            </div>
            <div className="mt-1 text-sm text-yellow-500">
              {lot.reservePrice + " Eth"}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

LotSummary.displayName = "LotSummary";

export default LotSummary;
