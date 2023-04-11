export function isSSRContext() {
  return typeof window === 'undefined';
}
