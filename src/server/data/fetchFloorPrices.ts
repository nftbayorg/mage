import { formatDate } from "../../utils/date";

type FloorPriceData = {
  fetchedAt: string;
  sources: Array<{
    sourceDomain: string;
    onSaleCount: number;
    floorAskPrice: number;
  }>
}

export default async function fetchFloorPrices(collectionAddress: string): Promise<FloorPriceData> {

  const options = {method: 'GET', headers: {accept: '*/*', 'x-api-key': 'demo-api-key'}};
  const response = await fetch(`https://api.reservoir.tools/collections/sources/v1?collection=${collectionAddress}`, options);
  const data = await response.json();

  if (response.ok) {
    const sources = data;

    console.log('Sources', data);
    if (sources) {
      return Object.assign(sources, {fetchedAt: formatDate(new Date())});
    } else {
      return Promise.reject(new Error(`No floor prices with the collection address "${collectionAddress}"`));
    }
  } else {
    return Promise.reject(new Error('Failed to get floor price data'));
  }
}
