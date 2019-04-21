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
const bg0 = white;
const bg1 = nearWhite;
const bg2 = lightGray;
const primary = orange;
const disabled = moonGray;
const activeBg = moonGray;
const edge = midGray;
const activeEdge = lightBlue;
const shadow = midGray;
const activeShadow = lightBlue;
const error = red;
const googleRed = '#DB4437';
const facebookBlue = '#3C5A99';
const transparent = 'rgba(255, 255, 255, 0)';
const darken = 'rgba(0, 0, 0, 0.125)';

const space = [ 0, '0.25em', '0.5em', '1em', '2em', '4em', '8em', '16em', '32em' ];

const theme = {
  buttons: {
    default: {
      color: fg1,
      border: `1px solid ${edge}`,
    },
    googleRed: {
      color: googleRed,
      border: `1px solid ${googleRed}`,
    },
    facebookBlue: {
      color: facebookBlue,
      border: `1px solid ${facebookBlue}`,
    },
  },
  colors: {
    fg1,
    activeBg,
    bg0,
    bg1,
    bg2,
    primary,
    disabled,
    edge,
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
  fonts: {
    brand: '"Josefin Slab", serif',
    sans: '"Noto Sans", sans-serif',
  },
  space,
  textInputs: {
    error: {
      'borderColor': red,
      'background': washedRed,
      ':active, :focus': {
        borderColor: red,
        background: washedRed,
        boxShadow: `0 0 1px 1px ${lightRed}`,
      },
    },
    valid: {
      'borderColor': green,
      ':active, :focus': {
        borderColor: green,
        boxShadow: `0 0 1px 1px ${lightGreen}`,
      },
    },
    minimal: {
      'borderWidth': '0px',
      'background': transparent,
      'flexGrow': 1,
      ':active, :focus': {
        borderWidth: '0px',
      },
      '::placeholder': {
        fontStyle: 'italic',
      },
    },
  },
};

export default theme;
