export const mapSeries = <T, R>(
  arr: T[],
  map: (p: T, index: number, arrayLength: number) => R | Promise<R>,
): Promise<R[]> => {
  if (!Array.isArray(arr)) throw new Error('mapSeries requires an Array');
  const results = new Array<R>(arr.length);

  return arr
    .reduce(
      (chain, item, i, inArr) =>
        chain
          .then(() => map(item, i, inArr.length))
          .then((val) => {
            results[i] = val;
          }),
      Promise.resolve(),
    )
    .then(() => results);
};
