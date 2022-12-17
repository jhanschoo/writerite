export const APP_PATH = '/app';
export const DECK_PATH = `${APP_PATH}/deck`;
export const DECK_DETAIL_PATH = (id: string) => `${DECK_PATH}/${id}`;
export const DECK_DETAIL_SUBDECK_PATH = (id: string) => `${DECK_DETAIL_PATH(id)}/subdeck`;
export const DECK_DETAIL_SUBDECK_LINK_PATH = (id: string) => `${DECK_DETAIL_SUBDECK_PATH(id)}/link`;
export const DECK_DETAIL_SUBDECK_IMPORT_PATH = (id: string) =>
  `${DECK_DETAIL_SUBDECK_PATH(id)}/import`;
export const DECK_DETAIL_IMPORT_PATH = (id: string) => `${DECK_DETAIL_PATH(id)}/import`;
export const ROOM_PATH = `${APP_PATH}/room`;
export const ROOM_DETAIL_PATH = (idOrSlug: string) => `${ROOM_PATH}/${idOrSlug}`;
export const PROFILE_PATH = `${APP_PATH}/user`;
