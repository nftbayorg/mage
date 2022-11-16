import { formatDate } from "../../../utils/date";

type CollectionData = {
  collections: Collection[]
}

type Collection = {
  id: string
  slug: string
  createdAt: string
  name: string
  image: string
  banner: string
  discordUrl: string
  externalUrl: string
  twitterUsername: string
  openseaVerificationStatus: string
  description: string
  sampleImages: string[]
  tokenCount: string
  onSaleCount: string
  primaryContract: string
  tokenSetId: string
  royalties: Royalties
  lastBuy: LastBuy
  floorAsk: FloorAsk
  rank: Rank
  volume: Volume
  volumeChange: VolumeChange
  floorSale: FloorSale
  floorSaleChange: FloorSaleChange
  collectionBidSupported: boolean
}

type Royalties = {
  bps: number
  recipient: string
}

type LastBuy = {
  value: any
}

type FloorAsk = {
  id: string
  sourceDomain: string
  price: Price
  maker: string
  validFrom: number
  validUntil: number
  token: Token
}

type Price = {
  currency: Currency
  amount: Amount
}

type Currency = {
  contract: string
  name: string
  symbol: string
  decimals: number
}

type Amount = {
  raw: string
  decimal: number
  usd: number
  native: number
}

type Token = {
  contract: string
  tokenId: string
  name: string
  image: string
}

type Rank = {
  "1day": number
  "7day": number
  "30day": number
  allTime: number
}

type Volume = {
  "1day": number
  "7day": number
  "30day": number
  allTime: number
}

type VolumeChange = {
  "1day": number
  "7day": number
  "30day": number
}

type FloorSale = {
  "1day": number
  "7day": number
  "30day": number
}

type FloorSaleChange = {
  "1day": number
  "7day": number
  "30day": number
}

export default async function fetchFloorPrices(collectionName: string): Promise<CollectionData> {

  const options = {method: 'GET', headers: {accept: '*/*', 'x-api-key': 'demo-api-key'}};

  const response = await fetch(`https://api.reservoir.tools/collections/v5?name=${collectionName}&includeTopBid=false&sortBy=allTimeVolume&limit=20`, options)
    const data = await response.json();
  
    if (response.ok) {
      const sources = data;
  
      if (sources) {
        return Object.assign(sources, {fetchedAt: formatDate(new Date())});
      } else {
        return Promise.reject(new Error(`No floor prices with the collection address "${collectionName}"`));
      }
    } else {
      return Promise.reject(new Error('Failed to get floor price data'));
    }
  }
  