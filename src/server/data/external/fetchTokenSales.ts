import { formatDate } from "../../../utils/date";


export interface Sale {
  id:               string;
  saleId:           string;
  token:            Token;
  orderId:          string;
  orderSource:      string;
  orderSide:        string;
  orderKind:        string;
  from:             string;
  to:               string;
  amount:           string;
  fillSource:       string;
  block:            number;
  txHash:           string;
  logIndex:         number;
  batchIndex:       number;
  timestamp:        number;
  price:            Price;
  washTradingScore: number;
}

export interface Price {
  currency: Currency;
  amount:   Amount;
}

export interface Amount {
  raw:     string;
  decimal: number;
  usd:     number;
  native:  number;
}

export interface Currency {
  contract: string;
  name:     string;
  symbol:   string;
  decimals: number;
}

export interface Token {
  contract:   string;
  tokenId:    string;
  name:       null;
  image:      null;
  collection: Collection;
}

export interface Collection {
  id:   null;
  name: null;
}

export default async function fetchTokenSales(contractAddress: string, tokenId: string): Promise<Sale[]> {

  const options = {method: 'GET', headers: {accept: '*/*', 'x-api-key': 'demo-api-key'}};

  
  const response = await fetch(`https://api.reservoir.tools/sales/v4?token=${contractAddress}%3A${tokenId}&limit=100`, options)
    const data = await response.json();
  
    if (response.ok) {
      const sources = data;
  
      if (sources) {
        return Object.assign(sources, {fetchedAt: formatDate(new Date())});
      } else {
        return Promise.reject(new Error(`No sales for token "${contractAddress}:${tokenId}"`));
      }
    } else {
      return Promise.reject(new Error('Failed to get token sales data'));
    }
  }
  