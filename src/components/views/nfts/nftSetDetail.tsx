import { DateAsWord } from "../../../utils/date";
import {
  FaEye,
  FaChartLine,
  FaEthereum,
  FaRegHeart,
  FaTag,
  FaTags,
  FaAlignLeft,  
  FaListUl,
} from "react-icons/fa";
import Link from "next/link";
import Image from '../../forms/controls/Image';
import { inferQueryOutput } from "../../../utils/trpc";
import { CollapsePanel } from "../../forms/controls/CollapsePanel";

type NftSet = inferQueryOutput<"nftSet.get">;
type Collection = inferQueryOutput<"collection.get">;

const NftSetHeader = ({
  collection,
  name,
}: {
  collection?: Collection | null;
  name: string;
}) => {
  if (!collection) return <></>

  return (
    <div className="flex-col space-y-6 mb-4 w-full">
      {collection &&  
        <Link href={`/collections/${collection?.id}`}>
          <div className="text-xl font-light text-blue-500 my-3 cursor-pointer">{collection.name}</div>
        </Link>
      }
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
        updatedAt: new Date(),
        published: true,
        visible: true 
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
    <section className="flex flex-col w-full space-y-4 lg:flex-row lg:space-x-6 lg:w-5/6 p-5 md:m-10 pt-0 border-gray-200 dark:border-gray-600 ">
      <div className="lg:hidden">
        <NftSetHeader
          collection={nftSet.collection as Collection}
          name={nftSet.name}
        />
      </div>

      <div className="flex flex-col lg:w-2/5 space-y-4">
        <section className="">
          <div className="flex p-3 dark:border-gray-600 border border-gray-200 border-b-0 rounded-xl rounded-b-none">
            <button className="flex items-center hover:text-blue-500 dark:hover:text-blue-500 text-xl text-gray-700 dark:text-gray-400">
              <FaEthereum className="fill-blue-500 mr-2" size={20} />
              Buy now
            </button>
            <button className="ml-auto hover:text-red-500  dark:hover:text-red-500">
              <FaRegHeart size={20} className="fill-gray-400 mr-2" />
            </button>
          </div>
          <div className="flex items-center justify-center cursor-pointer w-full h-[400px] md:h-[578px] relative rounded-b-xl border border-gray-200 dark:border-gray-400 border-t-0 rounded-xl rounded-t-none">
            <Image
              src={nftSet.imageUrl}
              alt={nftSet.name}
              layout="intrinsic"
              priority={true}
              width="800"
              height="800"
              objectFit="contain"
              className="rounded-b-xl"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg=="
            />
          </div>
        </section>

        <CollapsePanel
          label="Description"
          icon={<FaAlignLeft size={25} className="fill-gray-700 dark:fill-gray-400" />}
        >
          <div className="flex flex-col items-start justify-start">
            <div className="flex gap-2 w-full h-full text-md text-gray-700 dark:text-gray-200">
              By <div className="font-bold">{nftSet.creatorId}</div>
            </div>
            {nftSet.collection?.description && <div className="text-md text-gray-700 dark:text-gray-200">
              {nftSet.collection?.description}
            </div>}
          </div>
        </CollapsePanel>

        <CollapsePanel
          label="Properties"
          icon={<FaTags size={25} className="fill-gray-700 dark:fill-gray-400 rotate-90" />}
          collapsible={true}
        >
          <div className="flex flex-col items-start justify-start">

          </div>
        </CollapsePanel>
      </div>

      <section className="lg:w-3/5 flex flex-col gap-5">
        <div className="hidden lg:block">
          <NftSetHeader
            collection={nftSet.collection as Collection}
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
          </div>
        </CollapsePanel>

        <CollapsePanel 
          label="Listings"
          icon={<FaTag size={25} className="fill-gray-700 dark:fill-gray-400" />}
          collapsible={true}
        >
          <div className="flex flex-col justify-center items-center space-y-3 ">
            <Image
              src="/images/empty.png"
              alt="Empty listings"
              width="150"
              height="100"
              objectFit="cover"
              className="rounded-xl w-[150px] h-[100px]"
            />
            <div className="text-gray-700 dark:text-gray-200 text-xl">No listings yet</div>
          </div>
        </CollapsePanel>

        <CollapsePanel 
          label="Offers"
          icon={<FaListUl size={25} className="fill-gray-700 dark:fill-gray-400" />}
          collapsible={true}
        >
          <div className="flex flex-col justify-center items-center space-y-3 ">
            <Image
              src="/images/empty.png"
              alt="Empty listings"
              width="150"
              height="100"
              objectFit="cover"
              className="rounded-xl w-[150px] h-[100px]"
            />
            <div className="text-gray-700 dark:text-gray-200 text-xl">No offers yet</div>
          </div>
        </CollapsePanel>
      </section>
    </section>
  );
};

export default NftSetDetail;
