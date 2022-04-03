import { createTheme } from "@mui/material";

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		inverse: true;
	}
	interface ButtonPropsVariantOverrides {
		"large-action": true;
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

let theme = createTheme({
	typography: {
		fontFamily: ['"Noto Sans"', "sans-serif"].join(","),
		button: {
			textTransform: "none",
			fontWeight: "bold",
		},
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
		}
	}
});

export const emotionTheme = theme;