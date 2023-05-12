export const FETCH_DEPTH = process.env.FETCH_DEPTH
  ? parseInt(process.env.FETCH_DEPTH, 10)
  : 3;
if (isNaN(FETCH_DEPTH) || FETCH_DEPTH < 1) {
  throw Error('envvar FETCH_DEPTH needs to be unset or a positive integer');
}
export const CARD_ANSWERS_SEPARATOR = ',,';
