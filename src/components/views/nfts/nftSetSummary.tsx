import React from "react";
import Link from 'next/link';
import { inferQueryOutput } from "../../../utils/trpc";
import { timeRemaining } from '../../../utils/time';
import Image from '../../forms/controls/Image';

type NftSet = inferQueryOutput<"nftSet.getLean">;

const NftSetSummary = React.forwardRef<HTMLDivElement, { nftSet: NftSet}>(( props: { nftSet: NftSet }, ref) => {
  const { nftSet } = props;
  if (!nftSet) return <div>Loading...</div>;

  return (
    <Link href={`/nftSets/${nftSet.id}`}>
      <div ref={ref} className="flex-col hover:shadow-lg hover:shadow-gray-500/50 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <Image 
            src={nftSet.imageUrl} 
            alt={nftSet.name} 
            height={500} 
            width={500} 
            objectFit="contain"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="text-md">
            {nftSet.name}
          </div>
        </div>
      </div>
    </Link>
  )
})

NftSetSummary.displayName = 'NftSetSummary'

export default NftSetSummary;