export const toCamelCase = (value: string, capitalizeFirst = true) => {
  const re = capitalizeFirst
    ? /^([a-zA-Z])|[\W_]{1,}([a-zA-Z])/g
    : /[\W_]{1,}([a-zA-Z])/g;

  const val = value.replace(re, (...args) =>
    String(args[1] || args[2]).toUpperCase(),
  );

  if (capitalizeFirst) return val;

  return val.charAt(0).toLowerCase() + val.slice(1);
};
