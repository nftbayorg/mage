import { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { MdImageNotSupported } from "react-icons/md";

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ alt, className, src, fallbackImage, width, height }: MageImageProps) {
  const [loadingError, setLoadingError] = useState(false);
  const [imageSource, setImageSource] = useState('');

  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  const handleClickRetry = () => {
    setImageSource('');
    setImageSource(src as string);
  }

  useEffect(() => {
    setImageSource(src as string);
  }, [])

  return (
    <>
      <div 
        className={`${className} w-full flex relative items-center justify-center bg-gray-100`}
        style={{ 'height': `100%` }}
      >
        {!loadingError && 
          // eslint-disable-next-line @next/next/no-img-element 
          <img 
            alt={alt}
            className={`${className} object-cover`}
            src={imageSource || src as string || ''} 
            style={{ height: `100%`, width: `100%` }} 
            onError={() => {
              console.log('Error');
              setLoadingError(true);
            }}
          />
        }
        {loadingError &&
          <div 
            onClick={handleClickRetry} 
            className="flex flex-col gap-5 w-full items-center justify-center"
            style={{ height: `${height}px`, width: `100%` }} 
          >
            <MdImageNotSupported size={40} className="fill-gray-700"/>
            <div>Error loading image</div>
          </div>
        }
      </div>
    </>
  );
}