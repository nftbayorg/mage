import Link from "next/link";
import Image from "../../forms/controls/Image";

type CollectionPanelProps = {
  collectionId: string;
  featuredImageUrl: string | null;
  logoImageUrl: string;
  name: string;
}

export const CollectionPanel = ({ collectionId, logoImageUrl, featuredImageUrl, name }: CollectionPanelProps ) => {

  return (
    <Link href={`/collections/${collectionId}`}>
      <div className="flex flex-col items-center justify-center w-full h-80 rounded-lg hover:shadow-lg hover:shadow-gray-500/50 border border-gray-200 dark:border-gray-600 cursor-pointer relative">
        {logoImageUrl && (
          <div className="w-full h-80 relative rounded-t-lg overflow-hidden">
            <Image
              alt="image"
              objectFit="cover"
              layout="fill"
              src={featuredImageUrl || logoImageUrl}
              placeholder="blur"
              blurDataURL="/images/AwaitingImage600x400.png"
              className="rounded-t-lg transition transform-gpu hover:scale-125"
            />
          </div>
        )}
        <div className="p-1 absolute rounded-xl left-3 bottom-3 h-20 w-20 bg-white">
          <Image 
            className="rounded-lg"
            src={logoImageUrl} 
            alt="image"
          />
        </div>

        <div className="flex justify-start w-full p-5 pl-28 min-h-[50px] overflow-ellipsis">
          <div className="text-md">{name}</div>
        </div>
      </div>
    </Link>
  );
};
