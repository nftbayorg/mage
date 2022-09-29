import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const NavBar = () => {
  const { data } = useSession();
  const router = useRouter();

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
        <div className="hidden md:flex space-x-6">
          <Link href="/trade">
            <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
              Trade
            </a>
          </Link>
          {/* <Link href="/stake">
            <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
              Earn
            </a>
          </Link> */}
          {data && <Link href="/nfts/create">
            <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
              Create
            </a>
          </Link>}
          {data && <Link href="/collections">
            <a className="dark:text-gray-300 dark:hover:text-blue-500 hover:text-blue-500 text-gray-700">
              My Collections
            </a>
          </Link>}
        </div>
        <div className="hidden md:flex">
          {data && (
            <button
              className="hidden md:block hover:bg-blue-400 p-3 px-6 pt-2 text-white bg-blue-500 rounded"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          )}
          {!data && (
            <button
              className="hover:text-blue-500  p-3 px-6 pt-2"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
          )}
          {!data && (
            <button
              className="hidden md:block hover:bg-blue-400  p-3 px-6 pt-2 text-white bg-blue-500 rounded"
              onClick={() => router.push("/login")}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
