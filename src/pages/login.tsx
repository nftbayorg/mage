import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { getMageAuthSession } from "../server/common/get-server-session";
import { FaDiscord } from "react-icons/fa";

const Login: NextPage = () => {
  return (
    <>
      <div className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="text-4xl text-gray-700 font-medium dark:text-gray-300">
          Welcome to Mage
        </h1>
        <button
          className="mt-10 hover:bg-blue-400  p-3 px-6 pt-2 text-white bg-blue-500 rounded"
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
  const session = await getMageAuthSession(ctx);

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
