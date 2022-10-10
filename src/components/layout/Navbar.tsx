import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaBars, FaDollarSign, FaImage, FaRegUserCircle, FaSignOutAlt, FaTh, FaTimes, FaWallet } from "react-icons/fa";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import React from "react";
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
      <div className="flex gap-y-4 space-x-6 items-center justify-center w-full">
        <Link href="/trade" >
          <a className="outline-none dark:hover:text-blue-500 hover:text-blue-500">
            Trade
          </a>
        </Link>
        {session && <Link href="/nfts/create">
          <a className="outline-none dark:hover:text-blue-500 hover:text-blue-500">
            Create
          </a>
        </Link>}
      </div>
      <div className="flex justify-end md:flex-row md:ml-auto min-w-fit h-full">
        {session && (
          <NavMenu 
            icon={<FaRegUserCircle size={30}/>} 
            position="left"
          >
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
          </NavMenu>
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
      </div>
    </div>
    </>
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
