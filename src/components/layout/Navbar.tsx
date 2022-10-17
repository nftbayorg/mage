import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaCircleNotch, FaDollarSign, FaImage, FaRegUserCircle, FaSignOutAlt, FaTh, FaTimes, FaRegHeart, FaWallet } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { NavMenu, NavMenuItem  } from "./NavMenu";
import dynamic from "next/dynamic";

const SetTheme = dynamic(() => import("./SetTheme"), { ssr: false });

const MobileNav = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="mr-7 mt-2">
      <NavMenu
        position="left"
        icon={<FaRegUserCircle size={30} className="fill-gray-700 dark:fill-gray-400"/>}
        activeIcon={<FaTimes size={30} className="fill-gray-700 dark:fill-gray-400"/>}
      >
        <NavMenuItem
          icon={<FaDollarSign size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Trade"
          onClick={() => router.push("/trade")}
        />
        <NavMenuItem
          icon={<FaImage   size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Create"
          onClick={() => router.push("/nfts/create")}
        />
        <NavMenuItem 
          icon={<FaRegHeart size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Favorites" 
          onClick={() => router.push('/favorites')}
        />
        <NavMenuItem 
          icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="My Collections" 
          onClick={() => router.push('/collections')}
        />
        <SetTheme/>
        {session &&
          <>
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
        }      </NavMenu>
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
      <div className="flex gap-x-6 w-full items-center justify-center ml-auto lg:mr-[110px] mt-2">
        <Link href="/trade" >
          <a className="outline-none dark:hover:text-gray-500 hover:text-blue-500 ">
            Trade
          </a>
        </Link>
        <Link href="/nfts/create">
          <a className="outline-none dark:hover:text-gray-500 hover:text-blue-500">
            Create
          </a>
        </Link>
      </div>
      <div className="flex justify-end md:flex-row md:ml-auto min-w-fit h-full mr-9 mt-2">
        <NavMenu 
          icon={<FaRegUserCircle size={30}/>} 
          position="left"
        >
          <NavMenuItem 
            icon={<FaRegHeart size={20} className="fill-gray-700 dark:fill-gray-300"/>}
            caption="Favorites" 
            onClick={() => router.push('/favorites')}
          />
          <NavMenuItem 
            icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-300"/>}
            caption="My Collections" 
            onClick={() => router.push('/collections')}
          />
          {session && (
            <>
              <SetTheme/>
              <NavMenuItem 
                icon={<FaSignOutAlt size={20} className="fill-gray-700 dark:fill-gray-300"/>}
                caption="Sign Out" 
                onClick={() => signOut()}
              />
            </>
          )}
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
    </div>
    </>
  )
}

const NavBar = () => {

  const [transitioningPage, setTransitioningPage] = useState(false);
  const router = useRouter();


  useEffect(() => {
    let startTimeout: NodeJS.Timeout;
    const handleRouteChangeStart = (url: URL) => {
      startTimeout = setTimeout(() => {
        setTransitioningPage(true);
      }, 500);
    }

    const handleRouteChangeComplete = (url: URL) => {
      if (startTimeout) {
        clearTimeout(startTimeout);
      }

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

      if (startTimeout) {
        clearTimeout(startTimeout);
      }
    }
  }, [router.events]);

  return (
    <div className="top-0 left-0 w-full fixed z-[20000] bg-white dark:bg-slate-800">

      <nav className="relative container mx-auto px-6 py-2 md:p-6 md:py-3 pl-0 border-b border-gray-200 dark:border-gray-600">
        
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <div className="flex items-center">
              <div className="hidden md:block">
                <FaCircleNotch size={20} className={`
                  mr-3
                  mt-4
                  dark:fill-gray-300 
                  fill-gray-700 
                  ${transitioningPage ? "animate-spin dark:fill-gray-300 fill-blue-500" : "fill-white dark:fill-slate-800"}`}
                  />
              </div>
              <span className={`
                ml-4 md:ml-0
                text-5xl text-gray-700 font-medium 
                dark:text-gray-300
                cursor-pointer
                font-silkscreen
                `}>
                Mage
              </span>
              <div className="md:hidden">
                <FaCircleNotch size={15} className={`
                  ml-3
                  mt-6
                  dark:fill-gray-300 
                  fill-gray-700 
                  ${transitioningPage ? "animate-spin dark:fill-gray-300 fill-blue-500" : "fill-white dark:fill-slate-800"}`}
                  />
              </div>
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
    </div>
  );
};

export default NavBar;
