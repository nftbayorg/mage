import { ImageProps } from "next/image";
import { ReactEventHandler, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { BiLoaderAlt } from 'react-icons/bi';

type MageImageProps = ImageProps & {
  fallbackImage?: string;
  hideLoadingIndicator?: boolean;
}

export default function ImageFallback({ alt, className, src, fallbackImage, hideLoadingIndicator, width, height }: MageImageProps) {
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [loadingIndicator] = useState(!hideLoadingIndicator);
  const setTimeoutId = useRef<NodeJS.Timeout>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imgDimensions, setImgDimensions] = useState({ height: '100%', width: '100%' })

  if (!fallbackImage) fallbackImage = "/images/AwaitingImage600x400.png";

  const handleError = useCallback(() => {
    setAttempts(prev => prev+1);
  },[]);

  const handleLoadingComplete = useCallback((event: SyntheticEvent<HTMLImageElement, Event>) => {
    setImgDimensions({ height: event.currentTarget.naturalHeight.toString(), width: event.currentTarget.naturalWidth.toString() });
    setLoading(false);
    clearTimeout(setTimeoutId.current);
  }, [])

  useEffect(() => {
    if (attempts > 3) {
      setLoadingError(true);
    }
  }, [attempts]);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [])

  return (
    <>
      <div 
        className={`${className} w-full flex relative items-center justify-center bg-gray-100 dark:bg-slate-800`}
        style={{ 'height': `100%` }}
      >
        {!loadingError && 
          <div className="flex w-full h-full relative ">
            {loading && loadingIndicator && 
              <div className="w-full h-full absolute right-1 bottom-1">
                <div className="w-full h-full relative">

                  <div className="w-full h-full absolute left-2 top-2">
                    <BiLoaderAlt size={40} className="fill-gray-700 animate-spin" />                
                  </div>
                  <div className="text-sm w-full h-full absolute left-6 top-5">
                    {attempts}
                  </div>
                </div>
              </div>
            }
            { // eslint-disable-next-line @next/next/no-img-element 
              <img 
                alt={alt}
                ref={imageRef}
                className={`object-cover ${className}`}
                src={src as string} 
                style={imgDimensions} 
                onLoad={handleLoadingComplete}
                onError={handleError}
              />
            }
          </div>
        }
        {loadingError &&
          <div 
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