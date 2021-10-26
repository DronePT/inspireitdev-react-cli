export const toHyphen = (filename: string) =>
  filename
    .replace(/[\W_]/gi, '-')
    .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    .replace(/--/g, '-')
    .replace(/^-{1,}/, '')
    .toLowerCase();
