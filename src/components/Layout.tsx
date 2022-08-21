import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="dark:bg-slate-800">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
