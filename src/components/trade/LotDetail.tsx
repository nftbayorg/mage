import NextError from 'next/error';
import Image from 'next/image';
import { trpc } from "../../utils/trpc";
import { FaEye, FaEthereum, FaRegHeart, FaRegClock, FaTag, FaAlignLeft, FaWallet } from "react-icons/fa";
import Link from 'next/link';
import { useEffect } from 'react';

const LotDetail = ({ id }: { id: string }) => {

  const mutation = trpc.useMutation('lot.update');
  const lotQuery = trpc.useQuery(['lot.get', { id }]);

  useEffect(() => {
    console.log('Mutate');
    mutation.mutate({ id });
  }, [id])

  if (lotQuery.error) {
    return (
      <NextError
        title={lotQuery.error.message}
        statusCode={lotQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (lotQuery.status !== 'success') {
    return <>Loading...</>;
  }

  if (!lotQuery.data) {
    return <>Unknown lot...</>;
  }

  const { data: lot } = lotQuery;

  return (
    <section className="flex space-x-6 m-10 pt-0 border-gray-200 dark:border-gray-600 w-4/6">
      <div className="flex-col w-2/5 space-y-4">
        <section>
          <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl">
            <button className="flex items-center hover:text-blue-500 dark:hover:text-blue-500 text-xl text-gray-700 dark:text-gray-400">
              <FaEthereum className="fill-blue-500 mr-2" size={20}/>
              Buy now
            </button>
            <button className="ml-auto hover:text-red-500  dark:hover:text-red-500">
              <FaRegHeart/>
            </button>
          </div>
          <div className="rounded border-gray-200 dark:border-gray-600 cursor-pointer w-auto">
            <Image src={lot.nftEdition.url} alt={lot.nftEdition.name} width="500" height="600" className="rounded-b-xl"/>
          </div>
        </section>


        <section>
          <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center">
            <FaAlignLeft className="fill-gray-700 dark:fill-gray-400"/>
            <div className="ml-2 text-md font-semibold text-gray-700 dark:text-gray-400">
              Description
            </div>
          </div>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-b-xl items-center">
            <div className="m-5 text-md text-gray-700 dark:text-white">
                ABC - Abracadabra

                A collection of 10K immutable NFTs, 0% royalties.

                Made to remind you of how fun things were when we were kids, before growing up - let’s never stop having fun!
            </div>
          </div>
        </section>
      </div>
      <section className="w-3/5">
        <div className="flex-col space-y-6 mb-4">
          <div className="text-1xl text-blue-500 mb-3">
            {lot.nftEdition.nftSet.collection.name}
          </div>
          <div className="text-3xl font-semibold mb-5 text-gray-700 dark:text-gray-400">
            {lot.nftEdition.name}
          </div>
          <div className="flex space-x-10 items-center">
            <div className="flex space-x-2 items-center">
              <div className="text-1xl text-gray-700 dark:text-gray-400">
                Owned by 
              </div>
              <Link href="/">
                <div className="text-blue-500">
                  {lot.nftEdition.owner.userId}
                </div>
              </Link>
            </div>
            <div className="flex space-x-2 items-center">
              <FaEye className="fill-gray-700 dark:fill-gray-400" size={20}/>
              <div className="text-1xl text-gray-700 dark:text-gray-400">
                {lot.views} 
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-3 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center">
          <FaRegClock className="fill-gray-700 dark:fill-gray-400"/>
          <div className="ml-2 text-md text-gray-500">
            Sale ends {lot.auction.end.toISOString()}
          </div>
        </div>
        <div className="flex-col p-10 border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-xl items-start justify-start space-x-4">
            <div className="flex-col space-y-3">
              <div className="text-md text-gray-700 dark:text-gray-400">Current Price</div>
              <div className="flex items-center space-x-2 pb-5">
                <div className="text-3xl font-bold">{lot.reservePrice.toString()}</div>
                <FaEthereum className="fill-blue-500" size={30}/>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold">
                  <FaWallet className="fill-white" size={20}/>
                  <div className="text-white">
                    Buy Now
                  </div>
                </button>
                <button className="flex items-center space-x-4 py-4 px-10 rounded border border-gray-200 hover:bg-white">
                  <FaTag className="fill-blue-500" size={20}/>
                  <div className="text-blue-500 font-semibold">
                    Make Offer
                  </div>
                </button>
              </div>
            </div>
          </div>
      </section>
    </section>
  )
}

export default LotDetail;