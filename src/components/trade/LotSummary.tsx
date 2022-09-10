import Image from 'next/image';
import { trpc } from "../../utils/trpc";
import { timeRemaining } from '../../utils/time';
import Link from 'next/link';

const LotSummary = ({ lotId }: { lotId: string }) => {

  const result = trpc.proxy.lot.get.useQuery({ id: lotId })
  if (!result.data) return <div>Loading...</div>;
  const lot = result.data;

  return (
    <Link href={`/lot/${lot.id}`}>
      <div className="flex-col hover:shadow-lg hover:shadow-gray-500/50 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <Image src={lot.nftEdition.url} alt={lot.nftEdition.name} height={500} width={500} objectFit="contain"/>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="text-md">
            {lot.nftEdition.name}
          </div>
          <div className="mt-1 text-sm text-yellow-500">
            {lot.nftEdition.nftSet.collection.name}
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
}

export default LotSummary;