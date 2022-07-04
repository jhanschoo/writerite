import { createTheme } from "@mui/material";

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    inverse: true;
  }
  interface ButtonPropsVariantOverrides {
    "large-action": true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsSizeOverrides {
    "large": true;
    "largecentered": true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    inverse: Palette['primary'];
  }
  interface PaletteOptions {
    inverse?: PaletteOptions['primary'];
  }
}

const fontFamily = ['"Noto Sans"', "sans-serif"].join(",");

let theme = createTheme({
  typography: {
    fontFamily,
    h1: {
      fontFamily,
    },
    h2: {
      fontFamily,
    },
    h3: {
      fontFamily,
    },
    h4: {
      fontFamily,
    },
    h5: {
      fontFamily,
    },
    h6: {
      fontFamily,
    },
    subtitle1: {
      fontFamily,
    },
    subtitle2: {
      fontFamily,
    },
    body1: {
      fontFamily,
    },
    body2: {
      fontFamily,
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
      fontFamily,
    },
    caption: {
      fontFamily,
    },
    overline: {
      fontFamily,
    }
  },
  palette: {
    primary: {
      main: '#1c1c1c',
    },
    secondary: {
      main: '#c2c2c2',
    },
    inverse: {
      main: '#ffffff',
      contrastText: '#1c1c1c',
    }
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "large-action" },
          style: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[2],
            ...theme.typography.h5,
            textAlign: "left",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: theme.shadows[4],
            }
          }
        },
      ]
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "filled", size: "large" },
          style: {
            "& .MuiInputLabel-root": {
              fontSize: theme.typography.h5.fontSize,
              transform: "translate(18px, 24px) scale(1)"
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              fontSize: theme.typography.h5.fontSize,
              transform: "translate(18px, 10px) scale(0.75)"
            },
            "& .MuiInputBase-root": {
              fontSize: theme.typography.h5.fontSize,
            },
            "& .MuiInputBase-input": {
              paddingTop: "37px",
              paddingRight: "18px",
              paddingBottom: "12px",
              paddingLeft: "18px",
            },
          }
        },
        {
          props: { variant: "filled", size: "largecentered" },
          style: {
            "& .MuiInputLabel-root": {
              fontSize: theme.typography.h5.fontSize,
              width: "100%",
              textAlign: "center",
              maxWidth: "none",
              transform: "translate(0, 24px) scale(1)",
              transformOrigin: "center top",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(0, 10px) scale(0.75)",
            },
            "& .MuiInputBase-root": {
              fontSize: theme.typography.h5.fontSize,
            },
            "& .MuiInputBase-input": {
              textAlign: "center",
              paddingTop: "37px",
              paddingRight: "18px",
              paddingBottom: "12px",
              paddingLeft: "18px",
            },
          }
        }
      ]
    }
  }
});

export const emotionTheme = theme;