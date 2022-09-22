import Image from "next/image";
import { DateAsWord } from "../../utils/date";
import {
  FaEye,
  FaEthereum,
  FaRegHeart,
  FaRegClock,
  FaTag,
  FaAlignLeft,
  FaWallet,
} from "react-icons/fa";
import Link from "next/link";
import { inferQueryOutput } from "../../utils/trpc";

type Lot = inferQueryOutput<"lot.get">;

const LotHeader = ({
  collection,
  name,
  owner,
  views,
}: {
  collection?: string;
  name: string;
  owner: string;
  views: number;
}) => {
  return (
    <div className="flex-col space-y-6 mb-4">
      {collection &&  <div className="text-1xl text-blue-500 mb-3">{collection}</div>}
      <div className="text-3xl font-semibold mb-5 text-gray-700 dark:text-gray-400">
        {name}
      </div>
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-10 lg:items-center">
        <div className="flex space-x-1 lg:space-x-2 items-center">
          <div className="text-1xl text-gray-700 dark:text-gray-400">
            Owned by
          </div>
          <Link href="/">
            <div className="text-blue-500">{owner}</div>
          </Link>
        </div>
        <div className="flex space-x-2 items-center">
          <FaEye className="fill-gray-700 dark:fill-gray-400" size={20} />
          <div className="text-1xl text-gray-700 dark:text-gray-400">
            {views}
          </div>
        </div>
      </div>
    </div>
  );
};

type ComponentProps = {
  lot: Lot
}

const LotDetail = ({ lot }: ComponentProps) => {
  if (!lot) return <div>Loading...</div>

  return (
    <section className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:w-5/6 m-10 pt-0 border-gray-200 dark:border-gray-600 ">
      <div className="lg:hidden">
        <LotHeader
          collection={lot.nftEdition.nftSet.collection?.name}
          name={lot.nftEdition.nftSet.name}
          owner={lot.nftEdition.ownerId}
          views={lot.views}
        />
      </div>

      <div className="flex flex-col lg:w-2/5 space-y-4">
        <section>
          <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl">
            <button className="flex items-center hover:text-blue-500 dark:hover:text-blue-500 text-xl text-gray-700 dark:text-gray-400">
              <FaEthereum className="fill-blue-500 mr-2" size={20} />
              Buy now
            </button>
            <button className="ml-auto hover:text-red-500  dark:hover:text-red-500">
              <FaRegHeart />
            </button>
          </div>
          <div className="flex items-center justify-center rounded cursor-pointer w-auto relative">
            <Image
              src={lot.nftEdition.nftSet.imageUrl}
              alt={lot.nftEdition.nftSet.name}
              width="800"
              height="800"
              objectFit="contain"
              className="rounded-b-xl"
            />
          </div>
        </section>

        <section>
          <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center">
            <FaAlignLeft className="fill-gray-700 dark:fill-gray-400" />
            <div className="ml-2 text-md font-semibold text-gray-700 dark:text-gray-400">
              Description
            </div>
          </div>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-b-xl items-center">
            <div className="m-5 text-md text-gray-700 dark:text-white">
              {lot.nftEdition.nftSet.collection?.description}
            </div>
          </div>
        </section>
      </div>

      <section className="lg:w-3/5">
        <div className="hidden lg:block">
          <LotHeader
            collection={lot.nftEdition.nftSet.collection?.name}
            name={lot.nftEdition.nftSet.name}
            owner={lot.nftEdition.ownerId}
            views={lot.views}
          />
        </div>
        <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center">
          <FaRegClock className="fill-gray-700 dark:fill-gray-400" />
          <div className="ml-2 text-md text-gray-500">
            Sale ends {DateAsWord(lot.auction.end)}
          </div>
        </div>
        <div className="flex-col p-10 border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-xl items-start justify-start space-x-4">
          <div className="flex-col space-y-3">
            <div className="text-md text-gray-700 dark:text-gray-400">
              Current Price
            </div>
            <div className="flex items-center space-x-2 pb-5">
              <div className="text-3xl font-bold">
                {lot.reservePrice.toString()}
              </div>
              <FaEthereum className="fill-blue-500" size={30} />
            </div>
            <div className="flex-col flex lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <button className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold">
                <FaWallet className="fill-white" size={20} />
                <div className="text-white">Buy Now</div>
              </button>
              <button className="flex items-center justify-center space-x-4 py-4 px-10 rounded border border-gray-200 hover:bg-white">
                <FaTag className="fill-blue-500" size={20} />
                <div className="text-blue-500 font-semibold">Make Offer</div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default LotDetail;
