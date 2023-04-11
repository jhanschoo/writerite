/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const jestForAwaitOf = async <T>(
  ait: AsyncIterable<T>,
  timerAdvancement: () => unknown,
  body: (t: T) => Promise<unknown>
) => {
  const iterator = ait[Symbol.asyncIterator]();
  let nextP = iterator.next();
  timerAdvancement();
  try {
    let { value, done } = await nextP;
    while (!done) {
      await body(value as T);
      nextP = iterator.next();
      timerAdvancement();
      ({ value, done } = await nextP);
    }
  } catch (e) {
    await iterator.return?.(e);
    throw e;
  }
};
