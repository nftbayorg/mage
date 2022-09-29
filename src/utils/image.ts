import { NFTStorage, Blob } from "nft.storage";

const client = new NFTStorage({
  token: process.env.NFTSTORAGE_API_TOKEN || "",
});

export const uploadBase64ToIpfs = async (base64Data: string | undefined) => {
  if (!base64Data) return undefined;
  
  const base64 = Buffer.from(
    base64Data.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const blob = new Blob([base64]);
  const imageCid = await client.storeBlob(blob);

  return `https://nftstorage.link/ipfs/${imageCid}`;
}

