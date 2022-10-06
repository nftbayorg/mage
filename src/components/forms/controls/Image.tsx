import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ src, fallbackImage, ...rest }: MageImageProps) {
  const [imageSource, setImageSource] = useState(src);
  const [attempts, setAttempts] = useState(0); 


  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  useEffect(() => {
    setImageSource(src);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={imageSource}
      // loader={({ src }) => { return src }}
      onLoadingComplete={(result: { naturalWidth: number }) => {
        if (result.naturalWidth !== 0) return
        if (!fallbackImage) return

        if (attempts < 4) {
          setAttempts(prev => prev + 1);
          setImageSource(imageSource + `%3F_%3D${Math.floor(Math.random() * 100) + 1}`);
        } else {
          setImageSource(fallbackImage);
        }
      }}
      onError={() => {
        if (!fallbackImage) return

        if (attempts < 4) {
          setAttempts(prev => prev + 1);
          setImageSource(imageSource + `%3F_%3D${Math.floor(Math.random() * 100) + 1}`);
        } else {
          setImageSource(fallbackImage);
        }
    }}
    />
  );
}