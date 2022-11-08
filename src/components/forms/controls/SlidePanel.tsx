type SlidePanelProps = {
  visible: boolean;
  children: React.ReactElement;
}

export const SlidePanel = ({ children, visible }: SlidePanelProps) => {

  return (
    <div className={`
      flex flex-col
      transform-gpu transition-all ease-in-out delay-20 
      ${visible ? 'w-[0px] min-w-[0px] overflow-hidden' : 'sticky top-[150px] z-[5000] min-w-[350px] h-max'}`}
    >
      {children}
    </div>
  );
}
