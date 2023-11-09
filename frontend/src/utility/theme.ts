import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
	typography: {
		button: {
			fontWeight: '600',
			textTransform: 'capitalize',
		},
		h1: {
			fontSize: '60px',
			fontWeight: '700',
			color: '#1c1d25',
		},
		h2: {
			fontSize: '40px',
			fontWeight: '600',
			color: 'white',
		},
		h3: {
			fontSize: '20px',
			fontWeight: '500',
		},
		h6: {
			fontSize: '16px',
			fontWeight: '600',
			color: '#1c1d25',
		},
	},
	palette: {
		primary: {
			main: '#1C1D25',
		},
		text: {
			primary: 'rgba(255,255,255,1)',
			secondary: '#1C1D25',
		},
		background: {
			paper: '#d5d5d5',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ theme }: any) =>
					theme.unstable_sx({
						backgroundColor: '#1c1d25',
						boxShadow: '0',
						borderRadius: '8px',
						padding: { md: '10px 50px', xs: '8px 60px' },
						color: 'white',
						fontWeight: '600',
						'&:hover': {
							backgroundColor: '#1c1d40',
						},
					}),
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: ({ theme }: any) =>
					theme.unstable_sx({
						color: '#1c1d25',
						p: '10px 0px',
					}),
			},
		},
	},
})

console.log(theme)

export default theme
