import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ src, fallbackImage, ...rest }: MageImageProps) {
  const [imageSource, setImageSource] = useState(src);

  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  useEffect(() => {
    setImageSource(src);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={imageSource}
      unoptimized={true}
      // loader={({ src }) => { return src }}
      onLoadingComplete={(result: { naturalWidth: number }) => {
        if (result.naturalWidth !== 0) return
        if (!fallbackImage) return

        setImageSource(fallbackImage);
      }}
      onError={() => {
        if (!fallbackImage) return

        setImageSource(fallbackImage);
      }}
    />
  );
}