import React from "react";
import Image from 'next/image';
import { timeRemaining } from '../../utils/time';
import Link from 'next/link';
import { Decimal } from "@prisma/client/runtime";

type Lot = {
  id: string;
  reservePrice: Decimal;
  auction: {
    end: Date;
  }
  nftEdition: {
    nftSet: {
      imageUrl: string;
      name: string;
      collection: {
        name: string;
      } | null
    }
  }
}

const LotSummary = React.forwardRef<HTMLDivElement, { lot: Lot}>(( props: { lot: Lot }, ref) => {
  const { lot } = props;
  if (!lot) return <div>Loading...</div>;

  return (
    <Link href={`/lot/${lot.id}`}>
      <div ref={ref} className="flex-col hover:shadow-lg hover:shadow-gray-500/50 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <Image src={lot.nftEdition.nftSet.imageUrl} alt={lot.nftEdition.nftSet.name} height={500} width={500} objectFit="contain"/>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="text-md">
            {lot.nftEdition.nftSet.name}
          </div>
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
  )
})

LotSummary.displayName = 'LotSummary'

export default LotSummary;