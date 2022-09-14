import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    NextPage,
  } from "next";
import CreateItem from "../../components/CreateItem";
  import { getMageAuthSession } from "../../server/common/get-server-session";
  
  const Create: NextPage = () => {
  
    return (
      <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
        <div className="md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300">
          <h1 className="text-4xl my-5">Create New Item</h1>
          <CreateItem/>
        </div>
      </div>
    );
  };
  
  export const getServerSideProps: GetServerSideProps = async (
    ctx: GetServerSidePropsContext
  ) => {
    const session = await getMageAuthSession(ctx);
  
    if (!session) {
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
  
  export default Create;
  