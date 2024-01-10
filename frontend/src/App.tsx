import { ThemeProvider } from '@mui/material'
import './App.css'
import AppRouter from './routes/Router'
import theme from './utility/theme'

function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<AppRouter />
			</ThemeProvider>
		</>
	)
}

export default App
