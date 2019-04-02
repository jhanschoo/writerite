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
const activeBg = washedBlue;
const edge = midGray;
const activeEdge = darkBlue;
const shadow = silver;
const activeShadow = lightBlue;
const error = red;
const googleRed = '#DB4437';
const facebookBlue = '#3C5A99';

const space = [ 0, '0.25em', '0.5em', '1em', '2em', '4em', '8em', '16em', '32em' ];

const theme = {
  buttons: {
    default: {
      color: fg1,
      backgroundColor: bg1,
      border: `1px solid ${edge}`,
    },
    googleRed: {
      color: 'white',
      backgroundColor: googleRed,
    },
    facebookBlue: {
      color: 'white',
      backgroundColor: facebookBlue,
    },
  },
  colors: {
    fg1,
    activeBg,
    bg0,
    bg1,
    bg2,
    primary,
    edge,
    error,
    activeEdge,
    shadow,
    activeShadow,
    googleRed,
    facebookBlue,
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
        boxShadow: `0 0 0 2px ${lightRed}`,
      },
    },
    valid: {
      'borderColor': green,
      ':active, :focus': {
        borderColor: green,
        boxShadow: `0 0 0 2px ${lightGreen}`,
      },
    },
  },
};

export default theme;
