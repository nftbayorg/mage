import { DateAsMonthYearAsWords } from "../../../utils/date";
import NftSetSummary from "../nfts/nftSetSummary";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/trpc/router";
import { MdFilterList } from "react-icons/md";
import { VerifiedBadge } from "../../icons/VerifiedBadge";
import { useCallback, useState } from "react";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionMenu } from "./CollectionMenu";
import { OverlayPanel } from "../../forms/controls/OverlayPanel";
import { Button } from "../../forms/controls/Button";
import { SlidePanel } from "../../forms/controls/SlidePanel";
import { pluralize } from "../../../utils/strings";
import { useIsInViewport } from "../../../hooks/useIsInViewport";
import Label from "../../forms/controls/Label";
import { useCollectionStore } from "../../../hooks/useCollectionProperties";
import { Tag } from "../../forms/controls/Tag";
import { Radio, RadioButton } from "../../forms/controls/Radio";
import { MdGridOn, MdGridView } from "react-icons/md";

type Collection = inferProcedureOutput<AppRouter["collection"]["get"]>;

type ComponentProps = {
  collection: Collection | undefined;
  collectionProperties: CollectionNftSetProperties | null;
  floorPrice: number;
};

const CollectionDetail = ({ collection, floorPrice }: ComponentProps) => {

  const [menuHidden, setMenuHidden] = useState(false);
  const [mobileMenuHidden, setMobileMenuHidden] = useState(true);
  const selectedProperties = useCollectionStore(useCallback((state) => state.selectedProperties, []));
  const toggleSelectedPropertyIds = useCollectionStore(useCallback((state) => state.toggleSelectedPropertyIds, []));
  const resetSelectedProperties = useCollectionStore(useCallback((state) => state.resetSelectedProperties, []));
  const [gridCols, setGridCols] = useState<string | number>(4);

  const {
    isInViewport,
    observerRef
  } = useIsInViewport({ defaultState: true });
  
  const handleTagClosed = useCallback((propertyKey, ids) => {
    const splitKey = propertyKey.split(":").filter(p => p !== undefined);
    const keyValue = splitKey[0].replace(":", "");
    const nameValue =  splitKey[1]?.replace(" ","");

    toggleSelectedPropertyIds(keyValue, nameValue, ids);
  }, [toggleSelectedPropertyIds]);

  const handleResetProperties = useCallback(() => {
    resetSelectedProperties();
  }, [resetSelectedProperties]);

  const {
    bannerImageUrl,
    logoImageUrl,
    name,
    nftSets,
    createdAt,
    description,
    verified
  } = collection
    ? collection
    : {
        name: "",
        bannerImageUrl: "",
        logoImageUrl: "",
        nftSets: [],
        createdAt: undefined,
        description: "",
        verified: false
      };

  return (
    <div className="relative min-w-full">
      {!isInViewport &&
        <div className="md:hidden fixed bottom-1 left-[50%] translate-x-[-50%] z-[1000]">
          <Button 
            caption={`Filters ${Object.keys(selectedProperties).length ? Object.keys(selectedProperties).length : ''}`}
            icon={<MdFilterList size={30}/>}     
            onClick={() => setMobileMenuHidden(prev => !prev)}
          />
        </div>
      }

      <OverlayPanel 
        caption="Filters"
        visible={!mobileMenuHidden} 
        onClose={() => setMobileMenuHidden(true)}
      >
        <CollectionMenu/>
      </OverlayPanel>
      <section className="flex flex-col gap-y-5 w-full text-lg font-normal dark:text-gray-200 text-gray-700">
        <CollectionHeader
          bannerImageUrl={bannerImageUrl}
          collectionId={collection?.id}
          isLoading={collection ? false : true}
          logoImageUrl={logoImageUrl}
          owner={collection?.userId}
        />
          <section className="px-4 md:px-0">
            <section className="flex flex-col md:mb-10 md:px-10">
              <div className="flex items-center gap-2">
                <div className="text-2xl md:text-3xl font-semibold">
                  {name}
                </div>
                {verified && <VerifiedBadge/>}
              </div>

              <div className="flex gap-3 font-gray-500 my-5">
                <div className="flex gap-2">
                  <div className="font-bold">{`${nftSets.length}`}</div>
                  <div className="">{`${pluralize("Item", nftSets.length)}`}</div>
                </div>
                <div className="">-</div>
                {createdAt && (
                  <div className="flex gap-2">
                    <div className="">Created</div>
                    <div className="font-bold">{`${DateAsMonthYearAsWords(
                      createdAt
                    )}`}</div>
                  </div>
                )}
              </div>
              <div>
                <Label
                  caption= {description || `Welcome to the home of ${name} on Mage. Discover the best items in this collection.`}
                  collapsible={true}
                  defaultState="collapsed"
                />
              </div>
              <section className="hidden md:flex pt-5">
                <div className="flex flex-col">
                  <div>{floorPrice} ETH</div>
                  <div>Floor price</div>
                </div>
              </section>
            </section>
            <section className="flex flex-col w-full gap-1 py-5 md:p-10 md:pt-5">
              <div className="flex flex-col w-full bg-white dark:bg-slate-800">
                <div className="w-fit border-b-2 border-gray-800 dark:border-gray-300 pb-3 font-medium">
                  Items
                </div>
                <hr className="border dark:border-gray-700" />
              </div>
              <div className="hidden md:flex gap-5 w-full md:p-5 sticky top-[73px] z-[10000] bg-white dark:bg-slate-800">
                <div className="md:flex flex-wrap gap-5 w-full">
                  <button onClick={() => setMenuHidden(prev => !prev)}>
                    <MdFilterList size={30} className="m-3"/>
                  </button>
                  {Object.keys(selectedProperties).map((key, idx) => (
                    <Tag key={idx} caption={key} closable={true} onClose={() => handleTagClosed(key, selectedProperties[key])}/>
                  ))}
                  {Object.keys(selectedProperties).length > 0 && (
                    <div 
                      onClick={handleResetProperties}
                      className="flex h-full items-center justify-center p-0 mx-5 font-semibold cursor-pointer hover:text-gray-500"
                    >Clear all</div>
                  )}
                </div>
                <div className="ml-auto">
                  <Radio onChange={(value) => setGridCols(value)} defaultValue={gridCols}>
                    <RadioButton value={5} position="first">
                      <MdGridOn size={25} className="dark:fill-gray-300"/>
                    </RadioButton>
                    <RadioButton value={4} position="last">
                      <MdGridView size={25} className="dark:fill-gray-300"/>
                    </RadioButton>
                  </Radio>
                </div>
              </div>
              <section className="flex flex-col md:flex-row w-full">
                <div className="md:hidden" ref={observerRef}>
                  <Button 
                    caption={`Filters ${Object.keys(selectedProperties).length ? Object.keys(selectedProperties).length : ''}`}
                    icon={<MdFilterList size={30}/>}     
                    onClick={() => setMobileMenuHidden(prev => !prev)}
                  />
                </div>
                <div className="hidden md:flex">
                  <SlidePanel visible={menuHidden}>
                    <CollectionMenu/>
                  </SlidePanel>
                </div>
                {!collection?.nftSets.length ? 
                  <div className="flex items-center justify-center w-full border rounded-lg p-10 max-h-60">
                      <div className="text-1xl md:text-5xl">No items to display</div>
                  </div>
                  :
                  <div className={`pt-4 md:p-2 md:pt-0 grid grid-cols-2 ${menuHidden ? `md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-${Number(gridCols) +3}` : `md:grid-cols-2 lg:grid-cols-${gridCols} xl-grid-cols-5`} gap-2 md:gap-4 w-full md:h-fit md:overflow-scroll`}>
                    {collection?.nftSets.map((nftSet) => (
                      <div key={nftSet.id}>
                        <NftSetSummary nftSet={nftSet} collectionName={collection.name} verified={collection.verified}/>
                      </div>
                    ))}
                  </div>
                }
              </section>
            </section>
          </section>
      </section>
    </div>
  );
};

export default CollectionDetail;
