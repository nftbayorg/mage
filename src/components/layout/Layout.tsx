import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="dark:bg-slate-800 w-full flex flex-col items-center justify-center relative">
      <Navbar />
      <main className="w-full 2xl:w-5/6 mt-[60px] md:mt-[60px]">{children}</main>
      <Footer />
    </div>
  );
}
