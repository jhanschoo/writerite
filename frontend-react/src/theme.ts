// Tachyons color
// TODO: translate to variables for rgb
const black = '#000';
const highlight = '#FFFF00';
const nearBlack = '#111';
const darkGray = '#333';
const midGray = '#555';
const gray = '#777';
const silver = '#999';
const lightSilver = '#AAA';
const moonGray = '#CCC';
const lightGray = '#EEE';
const nearWhite = '#F4F4F4';
const white = '#FFF';
const darkRed = '#E7040F';
const red = '#FF4136';
const lightRed = '#FF725C';
const orange = '#FF6300';
const gold = '#FFB700';
const yellow = '#FFD700';
const lightYellow = '#FBF1A9';
const purple = '#5E2CA5';
const lightPurple = '#A463F2';
const darkPink = '#D5008F';
const hotPink = '#FF41B4';
const pink = '#FF80CC';
const lightPink = '#FFA3D7';
const darkGreen = '#137752';
const green = '#19A974';
const lightGreen = '#9EEBCF';
const navy = '#001B44';
const darkBlue = '#00449E';
const blue = '#357EDD';
const lightBlue = '#96CCFF';
const lightestBlue = '#CDECFF';
const washedBlue = '#F6FFFE';
const washedGreen = '#E8FDF5';
const washedYellow = '#FFFCEB';
const washedRed = '#FFDFDF';

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
const homogBg = bg0;
const heterogBg = bg2;
const primary = orange;
const deemphasizedFg = gray;
const darkEdge = fg1;
const lightEdge = lightSilver;
const shadow = moonGray;
const activeShadow = lightBlue;
const error = red;
const googleRed = '#DB4437';
const facebookBlue = '#3C5A99';
const transparent = 'rgba(255, 255, 255, 0)';
const darken = 'rgba(0, 0, 0, 0.125)';

export const breakpoints = [ '40rem', '52rem', '64rem' ];

export const fgbg = [
  `color: ${darkGray}; background: ${white};`,
  `color: ${darkGray}; background: ${nearWhite};`,
  `color: ${darkGray}; background: ${lightGray};`,
  `color: ${darkGray}; background: ${moonGray};`,
  `color: ${darkGray}; background: ${lightSilver};`,
  `color: ${darkGray}; background: ${silver};`,
];

export const bgfg = [
  `color: ${lightGray}; background: ${black};`,
  `color: ${lightGray}; background: ${nearBlack};`,
  `color: ${lightGray}; background: ${darkGray};`,
  `color: ${lightGray}; background: ${midGray};`,
  `color: ${lightGray}; background: ${gray};`,
];

export const edge = [transparent, darkGray, lightGray];

// TODO: organize space according to whether they are fixed (for organisms)
//   or variable (for molecules and below)
const theme = {
  breakpoints,
  space: [ 0, '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem' ],
  scale: ['0.875rem', '1rem', '1.25rem', '1.5rem', '2.25rem', '3rem', '5rem', '6rem'],
  fgbg,
  bgfg,
  edge,
  color: {
    fg0,
    fg1,
    fg2,
    fg3,
    fg4,
    fg5,
    bg0,
    bg1,
    bg2,
    bg3,
    bg4,
    homogBg,
    heterogBg,
    primary,
    deemphasizedFg,
    darkEdge,
    edge: fg3,
    lightEdge,
    error,
    shadow,
    activeShadow,
    googleRed,
    facebookBlue,
    transparent,
    darken,
    black,
    highlight,
    nearBlack,
    darkGray,
    midGray,
    gray,
    silver,
    lightSilver,
    moonGray,
    lightGray,
    nearWhite,
    white,
    darkRed,
    red,
    lightRed,
    orange,
    gold,
    yellow,
    lightYellow,
    purple,
    lightPurple,
    darkPink,
    hotPink,
    pink,
    lightPink,
    darkGreen,
    green,
    lightGreen,
    navy,
    darkBlue,
    blue,
    lightBlue,
    lightestBlue,
    washedBlue,
    washedGreen,
    washedYellow,
    washedRed,
  },
};

export default theme;
