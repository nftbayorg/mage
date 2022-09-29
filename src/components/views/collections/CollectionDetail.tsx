import { DateAsMonthYearAsWords } from "../../../utils/date";
import { inferQueryOutput } from "../../../utils/trpc";
import Image from 'next/image';

type Collection = inferQueryOutput<"collection.get">;

type CollectionHeaderProps = {
  bannerImageUrl?: string | undefined | null;
  logoImageUrl?: string;
}

const CollectionHeader = ({ bannerImageUrl, logoImageUrl }: CollectionHeaderProps) => {
  return (    
    <div className="flex-col w-full h-full mb-14 md:mb-24">
      {logoImageUrl ? 
        <div className="h-48 md:h-96 w-full relative">

        <Image
          src={bannerImageUrl || logoImageUrl} 
          alt="image"
          objectFit="cover"
          layout="fill"
          placeholder="blur"
          blurDataURL="https://nftstorage.link/ipfs/bafkreicbskrm57qslrodktuajali26hxjgdexg2batzhjbnktu63zbbncu"
        />
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-50 rounded-lg shadow-md p-1">
            <div className="w-full h-full p-1 relative">
              <Image className="rounded-lg"
                src={logoImageUrl} 
                alt="image"
                objectFit="cover"
                layout="fill"                
              />
            </div>
          </div>
        </div>
        :
        <div className="h-48 md:h-96 w-full relative">
          <div className="flex w-full h-full empty:bg-gray-100"/>
          <div className="w-24 h-24 md:w-48 md:h-48 bg-white absolute -bottom-10 left-5 md:-bottom-24 md:left-10 z-50 rounded-lg p-1 md:p-2 shadow-md">
            <div className="w-full h-full bg-gray-100 rounded-lg"/>
          </div>
        </div>
      }
   </div>
  );
};

type ComponentProps = {
  collection: Collection
}

const CollectionDetail = ({ collection }: ComponentProps) => {
  if (!collection) return <div>Loading...</div>

  const { bannerImageUrl, logoImageUrl, name, nftSets, createdAt, description  } = collection;
 
  function pluralize(word: string, value: number): string {
    const plural = value && (value > 0 || value === 0) ? '' : 's';
    return `${word}${plural}`;
  }

  return (
    <section className="flex flex-col w-full text-lg font-normal dark:text-gray-300 text-gray-700">
      <CollectionHeader logoImageUrl={logoImageUrl} bannerImageUrl={bannerImageUrl} />
      <section className="p-10">
        <section className="flex flex-col mb-10">
          <div className="text-2xl md:text-3xl font-semibold">{name}</div>
          <div className="flex gap-3 font-gray-500 my-5">
            <div className="flex gap-2">
              <div className="">{`${pluralize('Item', nftSets.length)}`}</div>
              <div className="font-bold">{`${nftSets.length}`}</div>
            </div>
            <div className="">-</div>
            <div className="flex gap-2">
              <div className="">Created</div>
              <div className="font-bold">{`${DateAsMonthYearAsWords(createdAt)}`}</div>
            </div>
          </div>
          <div>
            {description || `Welcome to the home of ${name} on Mage. Discover the best items in this collection.`}
          </div>
        </section>
        <section className="flex flex-col w-full">
          <div className="w-fit border-b-2 border-gray-700 pb-3 font-medium">Items</div>
          <hr className="border border-gray-200"/>
          <div>

          </div>
        </section>
      </section>
    </section>
  );
};

export default CollectionDetail;