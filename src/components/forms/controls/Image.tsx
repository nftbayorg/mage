import { ImageProps } from "next/image";

type MageImageProps = ImageProps & {
  fallbackImage?: string
}

export default function ImageFallback({ alt, className, src, fallbackImage, width, height, ...rest }: MageImageProps) {
  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  return (
    <>
      <div 
        className={`w-full flex relative items-center justify-center bg-gray-50 z-10`}
        style={{ 'height': `100%` }}
      >
        { 
          // eslint-disable-next-line @next/next/no-img-element 
        <img 
          alt="asset image"
          className={`${className} object-cover`}
          src={src as string} 
          style={{ height: `100%`, width: `100%` }} 
          {...rest}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src=fallbackImage || '';
          }}
        />
        }
      </div>
    </>
  );
}