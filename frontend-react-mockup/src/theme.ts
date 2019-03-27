const fg = "black";
const bg = "white";
const primary = "firebrick";
const googleRed = "#DB4437";
const facebookBlue = "#3C5A99";

const theme = {
  buttons: {
    default: {
      color: fg,
      backgroundColor: bg,
      border: `1px solid ${fg}`
    },
    googleRed: {
      color: "white",
      backgroundColor: googleRed
    },
    facebookBlue: {
      color: "white",
      backgroundColor: facebookBlue
    }
  },
  colors: {
    fg,
    bg,
    primary,
    googleRed,
    facebookBlue,
  },
  fonts: {
    brand: '"Josefin Slab", serif', 
    sans: '"Noto Sans", sans-serif',
  }
}

export default theme;
