export function generatedAvatarUrl(unsafeUuid: string, params?: URLSearchParams) {
  const url = new URL(
    `https://avatars.dicebear.com/api/bottts/${unsafeUuid.slice(-8)}.svg${
      params ? `?${params}` : ''
    }`
  );
  return url.toString();
}
