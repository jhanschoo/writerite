// Tachyons colors
// TODO: translate to variables for rgb
const black = '#000';
const brightYellow = '#FF0';
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

const fg1 = nearBlack;
const fg2 = gray;
const bg0 = white;
const bg1 = nearWhite;
const bg2 = lightGray;
const inputBg = bg0;
const homogBg = bg0;
const heterogBg = bg2;
const primary = orange;
const disabled = moonGray;
const edge = gray;
const lightEdge = silver;
const lightLightEdge = lightSilver;
const activeEdge = lightBlue;
const shadow = moonGray;
const activeShadow = lightBlue;
const error = red;
const googleRed = '#DB4437';
const facebookBlue = '#3C5A99';
const transparent = 'rgba(255, 255, 255, 0)';
const darken = 'rgba(0, 0, 0, 0.125)';

export const breakpoints = [ '40rem', '52rem', '64rem' ];

// TODO: organize space according to whether they are fixed (for organisms)
//   or variable (for molecules and below)
const theme = {
  breakpoints,
  space: [ 0, '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem' ],
  colors: {
    fg1,
    fg2,
    bg0,
    bg1,
    bg2,
    inputBg,
    homogBg,
    heterogBg,
    primary,
    disabled,
    edge,
    lightEdge,
    lightLightEdge,
    error,
    activeEdge,
    shadow,
    activeShadow,
    googleRed,
    facebookBlue,
    transparent,
    darken,
    black,
    brightYellow,
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
