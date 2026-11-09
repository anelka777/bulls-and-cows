export const memoize = <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  keyOf?: (...args: Args) => string,
): ((...args: Args) => R) => {
  void fn;
  void keyOf;
  throw new Error('not implemented');
};
