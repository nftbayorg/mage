import { DateAsWord } from "../../../utils/date";
import {
  FaEye,
  FaChartLine,
  FaEthereum,
  FaRegHeart,
  FaRegClock,
  FaTag,
  FaAlignLeft,
  FaWallet,
} from "react-icons/fa";
import Link from "next/link";
import Image from '../../forms/controls/Image';
import { inferQueryOutput } from "../../../utils/trpc";
import { CollapsePanel } from "../../forms/controls/CollapsePanel";

type NftSet = inferQueryOutput<"nftSet.get">;

const NftSetHeader = ({
  collection,
  name,
}: {
  collection?: string;
  name: string;
}) => {
  return (
    <div className="flex-col space-y-6 mb-4">
      {collection &&  <div className="text-xl font-light text-blue-500 my-3">{collection}</div>}
      <div className="text-4xl font-semibold py-5 text-gray-700 dark:text-gray-400">
        {name}
      </div>
    </div>
  );
};

type ComponentProps = {
  nftSet: NftSet | undefined;
}

const NftSetDetail = ({ nftSet }: ComponentProps) => {

  if (!nftSet) {
    nftSet = {
      name: "Awaiting data",
      collection: {
        id: "",
        blockChainId: "Awaiting data",
        name: "Awaiting data",
        description: "Awaiting data",
        bannerImageUrl: "",
        logoImageUrl: "",
        featureImageUrl: "",
        explicitContent: false,
        createdAt: new Date(),
        userId: "",
        displayThemee: "",
        updatedAt: new Date() 
      },
      imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg==",
      blockchainId: "",
      collectionId: "",
      createdAt: new Date(),
      creatorId: "",
      description: "Awaiting data",
      id: "",
      link: "",
      properties: [],
      updatedAt: new Date()
    }
  }

  return (
    <section className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:w-5/6 m-5 md:m-10 pt-0 border-gray-200 dark:border-gray-600 ">
      <div className="lg:hidden">
        <NftSetHeader
          collection={nftSet.collection?.name}
          name={nftSet.name}
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
              <FaRegHeart size={20} className="fill-gray-400 mr-2" />
            </button>
          </div>
          <div className="first-letter:first-line:flex items-center justify-center rounded cursor-pointer w-auto relative">
            <Image
              src={nftSet.imageUrl}
              alt={nftSet.name}
              width="800"
              height="800"
              objectFit="cover"
              className="rounded-b-xl"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg=="
            />
          </div>
        </section>

        <CollapsePanel
          label="Description"
          icon={<FaAlignLeft className="fill-gray-700 dark:fill-gray-400" />}
        >
          <div className="flex flex-col items-start justify-start">
            <div className="flex gap-2 w-full h-full text-md text-gray-700 dark:text-white">
              By <div className="font-bold">{nftSet.creatorId}</div>
            </div>
            {nftSet.collection?.description && <div className="text-md text-gray-700 dark:text-white">
              {nftSet.collection?.description}
            </div>}
          </div>
        </CollapsePanel>
      </div>

      <section className="lg:w-3/5 flex flex-col gap-5">
        <div className="hidden lg:block">
          <NftSetHeader
            collection={nftSet.collection?.name}
            name={nftSet.name}
          />
        </div>
        
        <CollapsePanel
          icon={<FaChartLine size={25} className="fill-gray-700 dark:fill-gray-400 font-light" />}
          label="Price History"
          collapsible={true}
          defaultState="collapsed"
        >
          <div className="flex-col space-y-3">
            <div className="text-md text-gray-700 dark:text-gray-400">
              Current Price
            </div>
            <div className="flex items-center space-x-2 pb-5">
              {/* <div className="text-3xl font-bold">
                {lot.reservePrice.toString()}
              </div> */}
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
        </CollapsePanel>

        <div>

          <div className="flex p-7 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center">
            <FaTag size={25} className="fill-gray-700 dark:fill-gray-400" />
            <div className="ml-5 text-xl text-gray-700 font-semibold">
              Listings
            </div>
          </div>
          <div className="flex-col p-10 border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-xl items-start justify-start space-x-4">
            <div className="flex-col space-y-3">
              <div className="text-md text-gray-700 dark:text-gray-400">
                Current Price
              </div>
              <div className="flex items-center space-x-2 pb-5">
                {/* <div className="text-3xl font-bold">
                  {lot.reservePrice.toString()}
                </div> */}
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
        </div>
      </section>
    </section>
  );
};

export default NftSetDetail;
