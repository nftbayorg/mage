import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { FaDiscord } from "react-icons/fa";

const Login: NextPage = () => {
  return (
    <>
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-310px)] p-4 mx-auto">
        <h1 className="text-2xl md:text-5xl text-gray-700 font-medium dark:text-gray-200 flex gap-2 items-center justify-center">
          <div className="pt-3 md:pt-0 ">Welcome to</div>
          <div className="font-silkscreen text-4xl md:text-6xl md:pb-3">Mage</div>
        </h1>
        <button
          className="
            mt-10 
            hover:bg-blue-400 text-white bg-blue-500 
            dark:border
            dark:border-gray-300
            dark:bg-white dark:bg-opacity-0
            dark:hover:bg-opacity-10
            p-3 px-6 pt-2
            rounded
          "
          onClick={() => signIn("discord")}
        >
          <div className="flex items-center">
            <FaDiscord size={30} />
            <div className="pl-2">Login with Discord</div>
          </div>
        </button>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: { destination: "/", permanent: false },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Login;
