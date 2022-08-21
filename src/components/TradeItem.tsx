import Image from 'next/image';
import { inferQueryOutput } from '../utils/trpc';

type Item = inferQueryOutput<'item.getAll'>[number];

const TradeItem = ({ item }: { item: Item }) => {
  return (
    <div className="hover:shadow-lg hover:shadow-gray-500/50 flex-col m-10 pt-0 rounded border border-gray-200 dark:border-gray-600 w-72 cursor-pointer">
      <div className="pr-10 pl-10">
        <Image src={`/images/nft${Math.floor(Math.random() * 9)+1}.png`} alt={item.name} width={200} height={274}/>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 p-4">
        <div className="text-md">
          {item.name}
        </div>
        <div className="mt-1 text-sm text-yellow-500">
          {item.collection.name}
        </div>
      </div>
    </div>
  )
}

export default TradeItem;