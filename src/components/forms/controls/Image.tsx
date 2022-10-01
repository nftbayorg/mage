import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export default function ImageFallback({ src, ...rest }: ImageProps) {
  const [imgSrc, set_imgSrc] = useState(src);
  const fallbackSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c/JkPQAHpgLfeHeKHwAAAABJRU5ErkJggg==";

  useEffect(() => {
    set_imgSrc(src);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={imgSrc}
      onLoadingComplete={(result: { naturalWidth: number }) => {
        if (result.naturalWidth === 0) {
          // Broken image
          set_imgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        set_imgSrc(fallbackSrc);
      }}
    />
  );
}