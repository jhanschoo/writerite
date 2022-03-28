declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		inverse: true;
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

export const theme = {
	typography: {
		fontFamily: ['"Noto Sans"', "sans-serif"].join(","),
		button: {
			textTransform: "none",
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
	}
} as const;
