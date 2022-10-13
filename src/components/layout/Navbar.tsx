import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaBars, FaDollarSign, FaImage, FaRegUserCircle, FaSignOutAlt, FaTh, FaTimes, FaWallet } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { NavMenu, NavMenuItem  } from "./NavMenu";
import dynamic from "next/dynamic";

const SetTheme = dynamic(() => import("./SetTheme"), { ssr: false });

const MobileNav = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="mr-5">
      <NavMenu
        position="left"
        icon={<FaBars size={30} className="fill-gray-700 dark:fill-gray-300"/>}
        activeIcon={<FaTimes size={30} className="fill-gray-700 dark:fill-gray-300"/>}
      >
        <NavMenuItem
          icon={<FaDollarSign size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Trade"
          onClick={() => router.push("/trade")}
        />
        {session &&
          <>
            <NavMenuItem
              icon={<FaImage   size={20} className="fill-gray-700 dark:fill-gray-300"/>}
              caption="Create"
              onClick={() => router.push("/nfts/create")}
            />
            <NavMenuItem 
              icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-300"/>}
              caption="My Collections" 
              onClick={() => router.push('/collections')}
            />
            <SetTheme/>
            <NavMenuItem 
              icon={<FaSignOutAlt size={20} className="fill-gray-700 dark:fill-gray-300"/>}
              caption="Sign Out" 
              onClick={() => signOut()}
            />
          </>
        }
        {!session && 
          <>
            <SetTheme/>
            <NavMenuItem 
              icon={<FaWallet size={20} className="fill-gray-700 dark:fill-gray-300 "/>}
              caption="Log In" 
              onClick={() => router.push('/login')}
            />
          </>
        }
      </NavMenu>
    </div>
  )
}


const MenuItems = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
    <div className="
      text-md 
      flex gap-y-8 flex-row items-center 
      w-full h-full
      dark:text-gray-300 text-gray-700 font-bold
    ">
      <div className="flex gap-x-6 w-full items-center justify-center md:mr-[55px]">
        <Link href="/trade" >
          <a className="outline-none dark:hover:text-gray-500 hover:text-blue-500 ">
            Trade
          </a>
        </Link>
        {session && <Link href="/nfts/create">
          <a className="outline-none dark:hover:text-gray-500 hover:text-blue-500">
            Create
          </a>
        </Link>}
      </div>
      <div className="flex justify-end md:flex-row md:ml-auto min-w-fit h-full mr-7">
        <NavMenu 
          icon={<FaRegUserCircle size={30}/>} 
          position="left"
        >
          {session && (
            <>
              <NavMenuItem 
                icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-300"/>}
                caption="My Collections" 
                onClick={() => router.push('/collections')}
              />
              <SetTheme/>
              <NavMenuItem 
                icon={<FaSignOutAlt size={20} className="fill-gray-700 dark:fill-gray-300"/>}
                caption="Sign Out" 
                onClick={() => signOut()}
              />
            </>
          )}
          {!session && (
            <>
              <SetTheme/>
              <NavMenuItem 
                icon={<FaWallet size={20} className="fill-gray-700 dark:fill-gray-300 "/>}
                caption="Log In" 
                onClick={() => router.push('/login')}
              />
            </>
          )}
        </NavMenu>
      </div>
    </div>
    </>
  )
}

const NavBar = () => {

  const [transitioningPage, setTransitioningPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = (url: URL) => {
      setTransitioningPage(true);
    }

    const handleRouteChangeComplete = (url: URL) => {
      setTransitioningPage(false);
    }

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);


    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
      }
  }, [router.events]);

  return (
    <nav className="relative container mx-auto p-6 border-b border-gray-200 dark:border-gray-600">
      
      <div className="flex items-center justify-between">
        <Link href="/" passHref>
          <div className="flex items-center">
            <span className={`text-4xl text-gray-700 font-medium dark:text-gray-300 cursor-pointer ${transitioningPage ? "animate-pulse" : ""}`}>
              Mage
            </span>
          </div>
        </Link>
        <div className="w-full hidden md:block">
          <MenuItems/>
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
