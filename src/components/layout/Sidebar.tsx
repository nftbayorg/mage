import Link from "next/link";
import Image from "../forms/controls/Image";
import { Collection } from "prisma/prisma-client";

type SidebarProps = {
  collections: Collection[];
}

const Sidebar = ({ collections }: SidebarProps) => {

  const salesTypes = ["Fixed Price", "Auction"];
  const categories = ["Premium", "Art", "Sports", "Entertainment", "Gaming", "Collectables", "Esports", ""];

  return (
    <nav className="hidden lg:flex p-5 w-72 h-screen overflow-scroll border-r border-gray-200 dark:border-gray-600">
      <div className="flex-col w-full">
        <div className="text-2xl text-gray-700 font-semibold dark:text-gray-200">
          Collections
        </div>
        <div className="mt-5 ml-2 flex-col overflow-y-scroll max-h-50 w-full">
          {collections.map(item => {
            return (
              <Link href={`collections/${item.id}`} key={item.id}>
                {/* <GiAbstract116 color={item.color || "white"}/> */}
                <div className="flex items-center text-gray-700 gap-x-5 dark:text-gray-200 cursor-pointer hover:text-blue-500  dark:hover:text-gray-500 mt-5">
                    <div className="h-[20px] w-[20px] min-w-[20px]">
                      <Image 
                        alt="collection logo"
                        src={item.logoImageUrl}
                        className="rounded-full"
                        hideLoadingIndicator={true}
                      />
                    </div>
                    <div>{item.name}</div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-2xl text-gray-700 font-semibold dark:text-gray-200">
          Sales Type
        </div>
        <div className="mt-5 ml-2 flex-col">
          {salesTypes && salesTypes.map(item => {
            return (
              <a className="block text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-500  dark:hover:text-gray-500 mt-5" key={item}>
                {item}
              </a>
            )
          })}
        </div>

        <div className="mt-10 text-2xl text-gray-700 font-semibold dark:text-gray-200">
          Categories
        </div>
        <div className="mt-5 ml-2 flex-col">
          {categories && categories.map(item => {
            return (
              <a className="block text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-500  dark:hover:text-gray-500 mt-5" key={item}>
                {item}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
