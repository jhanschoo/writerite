export const nextTick = <T> (callback: () => T) => new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback());
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
