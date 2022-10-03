import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const MobileNav = () => {
  const [active, setActive] = useState(false);  

  function handleClick() {
    setActive(currentActive => !currentActive);
  }

  return (
    <>
      <div className="relative md:hidden">
        {!active && <FaBars size={30} className="fill-gray-700" onClick={handleClick}/>}
        {active && <FaTimes size={30} className="fill-gray-700" onClick={handleClick}/>}
        <div className={`${!active ? "opacity-0": "opacity-100"} transition-opacity ease-in-out delay-150 border h-60 w-72 bg-white absolute md:relative top-10 right-1 rounded-lg shadow-lg p-10`}>
          {<MenuItems/>}
        </div>
      </div>
      <div className="hidden md:flex space-x-6 justify-center items-center w-full">
        <MenuItems/>
      </div>
    </>
  )
}

const MenuItems = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-y-8 md:flex-row md:items-center md:justify-center w-full">
      <div className="flex flex-col gap-y-4 md:flex-row md:space-x-6 md:items-center md:justify-center w-full">
        <Link href="/trade">
          <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
            Trade
          </a>
        </Link>
        {session && <Link href="/nfts/create">
          <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
            Create
          </a>
        </Link>}
        {session && <Link href="/collections">
          <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
            My Collections
          </a>
        </Link>}
      </div>
      <div className="flex flex-col md:flex-row md:ml-auto min-w-fit">
        {session && (
          <button
            className="md:block hover:bg-blue-400 p-3 px-6 pt-2 text-white bg-blue-500 rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        )}
        {!session && (
          <button
            className="hover:text-blue-500 p-3 px-6 pt-2"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        )}
        {!session && (
          <button
            className="md:block hover:bg-blue-400  p-3 px-6 pt-2 text-white bg-blue-500 rounded"
            onClick={() => router.push("/login")}
          >
            Register
          </button>
        )}
      </div>
    </div>
  )
}

const NavBar = () => {
  return (
    <nav className="relative container mx-auto p-6 border-b border-gray-200 dark:border-gray-600">
      
      <div className="flex items-center justify-between">
        <Link href="/" passHref>
          <div className="flex items-center">
            <span className="text-4xl text-gray-700 font-medium dark:text-gray-300 cursor-pointer">
              Mage
            </span>
          </div>
        </Link>
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
