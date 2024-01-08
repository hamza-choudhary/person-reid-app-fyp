import { ThemeProvider } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import theme from './utility/theme'
// import Gallery from "./pages/MyGallery";
import AboutUs from './pages/AboutUs'
import Auth from './pages/Auth'
import Galleries from './pages/Galleries'
import Gallery from './pages/Galleries/Gallery'
import Inference from './pages/Inference'
import QueryPage from './pages/Query'
import Results from './pages/Results'
import Result from './pages/Results/Result'
// import FileDropZone from "./pages/Test";
// import YourFormComponent from "./pages/Test";

function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/galleries" element={<Galleries />} />
					<Route path="/galleries/:galleryId" element={<Gallery />} />
					<Route path="/queries" element={<QueryPage />} />
					<Route path="/results" element={<Results />} />
					<Route path="/results/:resultId" element={<Result />} />
					<Route path="/inference" element={<Inference />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/about-us" element={<AboutUs />} />
					{/* <Route path="/test" element={<GalleryV2 />} /> */}
				</Routes>
			</ThemeProvider>
		</>
	)
}

export default App
