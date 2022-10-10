import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

type CarouselProps = {
  children: React.ReactNode;
}

export const Carousel = ({ children }: CarouselProps) => {
  return (
    <div className="flex relative w-full h-fit">
      <FaChevronCircleLeft className="rounded-full h-4 w-4 absolute left-1 top-[50%]"/>
      <FaChevronCircleRight className="rounded-full h-4 w-4 absolute right-1 top-[50%]"/>
      <div className="grid grid-cols-10 grid-rows-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}