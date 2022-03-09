export const toHyphen = (filename: string) =>
  filename
    .replace(/[\W_]/gi, '-')
    .replace(
      /([a-z]|^)([A-Z])/g,
      (_v, l1, l2) => `${l1.toLowerCase()}-${l2.toLowerCase()}`,
    )
    .replace(/--/g, '-')
    .replace(/^-{1,}/, '')
    .toLowerCase();
