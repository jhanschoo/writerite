/* eslint-disable @typescript-eslint/no-unused-vars */
import styled, { ThemedStyledInterface } from "styled-components";
/*
 * Tachyons color
 * TODO: translate to variables for rgb
 */
const black = "#000";
const highlight = "#FFFF00";
const nearBlack = "#111";
const darkGray = "#333";
const midGray = "#555";
const gray = "#777";
const silver = "#999";
const lightSilver = "#AAA";
const moonGray = "#CCC";
const lightGray = "#EEE";
const nearWhite = "#F4F4F4";
const white = "#FFF";
const darkRed = "#E7040F";
const red = "#FF4136";
const lightRed = "#FF725C";
const orange = "#FF6300";
const gold = "#FFB700";
const yellow = "#FFD700";
const lightYellow = "#FBF1A9";
const purple = "#5E2CA5";
const lightPurple = "#A463F2";
const darkPink = "#D5008F";
const hotPink = "#FF41B4";
const pink = "#FF80CC";
const lightPink = "#FFA3D7";
const darkGreen = "#137752";
const green = "#19A974";
const lightGreen = "#9EEBCF";
const navy = "#001B44";
const darkBlue = "#00449E";
const blue = "#357EDD";
const lightBlue = "#96CCFF";
const lightestBlue = "#CDECFF";
const washedBlue = "#F6FFFE";
const washedGreen = "#E8FDF5";
const washedYellow = "#FFFCEB";
const washedRed = "#FFDFDF";

const fg0 = black;
const fg1 = nearBlack;
const fg2 = darkGray;
const fg3 = midGray;
const fg4 = gray;
const fg5 = silver;
const bg0 = white;
const bg1 = nearWhite;
const bg2 = lightGray;
const bg3 = moonGray;
const bg4 = lightSilver;
const error = red;
const valid = green;
const googleRed = "#DB4437";
const facebookBlue = "#3C5A99";
const transparent = "rgba(0, 0, 0, 0)";
const darken = "rgba(0, 0, 0, 0.25)";
const blacken = "rgba(0, 0, 0, 0.75)";
const lighten = "rgba(255, 255, 255, 0.25)";
const whiten = "rgba(255, 255, 255, 0.75)";

export const breakpoints = ["40rem", "52rem", "64rem"];

const fg = [black, nearBlack, darkGray, midGray, gray];
const bg = [white, nearWhite, lightGray, moonGray, lightSilver];
/*
 * light borders are typically bg[3]
 * dark borders are typically bg[3]
 */

export const fgbg = (bgi: (typeof bg)[number]): string => {
  // eslint-disable-next-line prefer-destructuring
  let color: (typeof fg)[number] = fg[2];
  switch (bgi) {
    case bg[3]:
      // fallthrough
    case bg[4]:
      // eslint-disable-next-line prefer-destructuring
      color = fg[1];
      break;
    default:
      break;
  }
  return `color: ${color}; background: ${bgi};`;
};
export const bgfg = (fgi: (typeof fg)[number]): string => {
  // eslint-disable-next-line prefer-destructuring
  let color: (typeof bg)[number] = bg[2];
  switch (fgi) {
    case fg[3]:
      // fallthrough
    case fg[4]:
      // eslint-disable-next-line prefer-destructuring
      color = bg[1];
      break;
    default:
      break;
  }
  return `color: ${color}; background: ${fgi};`;
};

export const edge = [transparent, darkGray, lightGray];

/*
 * TODO: organize space according to whether they are fixed (for organisms)
 *   or variable (for molecules and below)
 */
const theme = {
  breakpoints,
  space: ["0", "0.25rem", "0.5rem", "1rem", "2rem", "4rem", "8rem", "16rem", "32rem"],
  scale: ["0.875rem", "1rem", "1.25rem", "1.5rem", "2.25rem", "3rem", "5rem", "6rem"],
  fg,
  bg,
  fgbg,
  bgfg,
  edge,
  color: {
    darken,
    whiten,
    googleRed,
    facebookBlue,
    error,
    valid,
  },
};

export type WrTheme = typeof theme;

export const wrStyled = styled as ThemedStyledInterface<WrTheme>;

export default theme;
