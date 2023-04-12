import md5 from "md5";

export const emailToGravatarLink = (email: string): string =>
  `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
