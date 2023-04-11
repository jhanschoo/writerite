export function sleep(ms: number): Promise<void>;
export function sleep<T>(ms: number, callback: () => T): Promise<T>;
export function sleep<T>(ms: number, callback?: () => T) {
  return new Promise<T | void>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback?.());
      } catch (error) {
        reject(error);
      }
    }, ms);
  });
}
