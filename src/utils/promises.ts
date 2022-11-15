export const determineResult = <T>(
  result:
    | PromiseSettledResult<T>
    | undefined
) => {
  if (result && result.status === "fulfilled" && result.value) {
    return result.value;
  }

  return "";
};
