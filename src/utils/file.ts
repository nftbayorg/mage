export const convertBase64 = (base64Image: string) => {
  const atob = (data: string) => Buffer.from(data, "base64").toString("ascii");
  const parts = base64Image.split(";base64,");

  if (!parts || !parts[0] || !parts[1]) return undefined;

  const imageType = parts[0]?.split(":")[1];
  const decodedData = atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);

  return { data: uInt8Array.buffer, type: imageType };
};
