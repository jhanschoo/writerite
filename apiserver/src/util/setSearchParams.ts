export function setSearchParams(url: URL, params: { [key: string]: string }): URL {
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url;
}
