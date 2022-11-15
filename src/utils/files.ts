export const readFiles = async (files: Array<File | undefined>) => {
  let promises = Array.from(files).map((file) => {
    if (file) {
      let reader = new FileReader();
      return new Promise<ArrayBuffer | string | null>((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  });

  let res = await Promise.allSettled(promises);

  return res;
};
