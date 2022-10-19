import Link from "next/link";
import { MdVerified } from "react-icons/md";
import Image from "../../forms/controls/Image";

type CollectionPanelContent = {
  id: string;
  featureImageUrl: string | null;
  logoImageUrl: string;
  name: string;
  verified: boolean;
}

type CollectionPanelProps = {
  collection?: CollectionPanelContent;
}

const CollectionSkeleton = () => {
  return (
    <div className="
        flex flex-col items-center justify-center 
        w-full h-80 lg:h-96 
        rounded-lg 
        hover:shadow-lg hover:shadow-gray-500/50 border border-gray-200 dark:border-gray-600 
        cursor-pointer 
        relative
    ">
      <div className="bg-gray-300 w-full h-full relative rounded-t-lg overflow-hidden animate-pulse"/>
      <div className="p-1 absolute rounded-xl left-3 bottom-3 h-20 w-20 bg-white">
        <div className="bg-gray-300 w-full h-full relative rounded-lg overflow-hidden animate-pulse"/>
      </div>
      <div className="flex justify-start w-full p-5 pl-28 min-h-[65px] overflow-ellipsis">
        <div className="bg-gray-300 pr-6 h-[25px] w-full rounded-md animate-pulse"/>
      </div>
    </div>
  )
}

const CollectionContent = ({ id, logoImageUrl, featureImageUrl, name, verified }: CollectionPanelContent) => (
  <Link href={`/collections/${id}`}>
    <div className="
        flex flex-col items-center justify-center 
        w-full h-80 md:h-96 2xl:h-96 
        rounded-lg 
        hover:shadow-lg hover:shadow-gray-500/50 border border-gray-200 dark:border-gray-600 
        cursor-pointer 
        relative
    ">
      {logoImageUrl && (
        <div className="w-full h-80 2xl:h-96 relative rounded-t-lg overflow-hidden">
          <Image
            alt="image"
            objectFit="cover"
            layout="fill"
            src={featureImageUrl || logoImageUrl}
            placeholder="blur"
            blurDataURL="/images/AwaitingImage600x400.png"
            className="rounded-t-lg transition transform-gpu hover:scale-125"
          />
        </div>
      )}
      <div className="p-1 absolute rounded-xl left-3 bottom-[65px] h-20 w-20 bg-white dark:bg-slate-800">
        <Image 
          className="rounded-lg"
          src={logoImageUrl} 
          alt="image"
        />
      </div>

      <div className="flex justify-start items-center w-full p-5 min-h-[90px] lg:min-h[80px] overflow-ellipsis gap-2">
        <div className="md:text-md font-light text-ellipsis overflow-hidden whitespace-nowrap">
          {name}
        </div>
          {verified && 
            <span className="verified_icon">
              <MdVerified size={20}/>
              <div className="verified_icon_bg">
                <MdVerified size={20} className=""/>
              </div>
            </span>
          }
      </div>
    </div>
  </Link>
)

export const CollectionPanel = ({ collection }: CollectionPanelProps ) => {
  collection;

  return (
    <>
      {!collection && <CollectionSkeleton/>}
      {collection && <CollectionContent 
        id={collection.id}
        logoImageUrl={collection.logoImageUrl}
        featureImageUrl={collection.featureImageUrl}
        name={collection.name}
        verified={collection.verified}
      />}
    </>
  );
};
