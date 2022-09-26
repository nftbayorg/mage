import { inferQueryOutput } from "../../../utils/trpc";

type Collection = inferQueryOutput<"collection.get">;

const CollectionHeader = () => {
  return (
    <div className="flex-col space-y-6 mb-4">
    </div>
  );
};

type ComponentProps = {
  collection: Collection
}

const CollectionDetail = ({ collection }: ComponentProps) => {
  if (!collection) return <div>Loading...</div>

  return (
    <section className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:w-5/6 m-10 pt-0 border-gray-200 dark:border-gray-600 ">
      <div className="lg:hidden">
        <CollectionHeader />
      </div>
    </section>
  );
};

export default CollectionDetail;
