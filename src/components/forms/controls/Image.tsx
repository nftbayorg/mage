import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ src, fallbackImage, ...rest }: MageImageProps) {
  const [imgageSource, setImgageSource] = useState(src);

  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  useEffect(() => {
    setImgageSource(src);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={imgageSource}
      onLoadingComplete={(result: { naturalWidth: number }) => {
        if (result.naturalWidth === 0) {
          setImgageSource(fallbackImage || '');
        }
      }}
      onError={() => {
        setImgageSource(fallbackImage || '');
      }}
    />
  );
}