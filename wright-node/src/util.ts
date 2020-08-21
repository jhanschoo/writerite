export const shuffle = <T>(arr: T[]): void => {
  // shuffle
  for (let i = 0; i < arr.length; ++i) {
    const j = Math.floor(Math.random() * (arr.length - i) + i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

export const noop = (..._args: unknown[]): void => undefined;
