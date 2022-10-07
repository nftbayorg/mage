import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
 

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ alt, className, src, fallbackImage, width, height, ...rest }: MageImageProps) {
  const [imageSource, setImageSource] = useState(src);
  const [classes, setClasses] = useState(`${className || ""} ${"hidden"}`);
  const [loaded, setLoaded] = useState(false);

  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  useEffect(() => {
    setImageSource(src);
  }, [src]);

  return (
    <>
      {!loaded && 
        <div 
          className={`w-full flex relative items-center justify-center bg-gray-50 z-10`}
          style={{ 'height': `100%` }}
        >
            <AiOutlineLoading3Quarters size={40} className={`animate-spin h-full`}/>
        </div>
      }
      <Image
        {...rest}
        alt={alt}
        width={width}
        height={height}
        src={imageSource}
        className={classes}
        onLoadingComplete={(result: { naturalWidth: number }) => {
          setClasses(`${className || ""} ${"visible"}`)
          setLoaded(true);

          if (result.naturalWidth !== 0) return
          if (!fallbackImage) return

          setImageSource(fallbackImage);
        }}
        onError={() => {
          if (!fallbackImage) return

          setImageSource(fallbackImage);
        }}
      />
    </>
  );
}