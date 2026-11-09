export const memoize = <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  keyOf: (...args: Args) => string = (...args) => JSON.stringify(args),
): ((...args: Args) => R) => {
  const cache = new Map<string, R>();

  return (...args) => {
    const key = keyOf(...args);
    if (cache.has(key)) {
      return cache.get(key) as R;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
