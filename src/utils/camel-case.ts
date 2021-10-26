export const toCamelCase = (value: string, capitalizeFirst = true) => {
  const re = capitalizeFirst
    ? /^([a-zA-Z])|[\W_]{1,}([a-zA-Z])/gi
    : /[\W_]{1,}([a-zA-Z])/gi;

  return value.replace(re, (...args) =>
    String(args[1] || args[2]).toUpperCase(),
  );
};
