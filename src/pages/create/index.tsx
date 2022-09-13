import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    NextPage,
  } from "next";
import CreateItem from "../../components/CreateItem";
  import { getMageAuthSession } from "../../server/common/get-server-session";
  
  const Create: NextPage = () => {
  
    return (
      <div className="flex">
        <div className="md:p-4 text-2xl flex-1 h-screen text-gray-700 font-medium dark:text-gray-300 overflow-y-scroll">
          Create
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <CreateItem/>
          </div>
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
  