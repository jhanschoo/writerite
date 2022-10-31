export function handleError(e: unknown): null {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }

  return null;
}
