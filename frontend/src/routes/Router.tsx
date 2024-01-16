import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from '../components/MainLayout/MainLayout'
import AboutUs from '../pages/AboutUs'
import Employees from '../pages/Employees/Employees'
import Galleries from '../pages/Galleries'
import Gallery from '../pages/Galleries/Gallery'
import GalleryVideos from '../pages/Galleries/GalleryVideos'
import Home from '../pages/Home'
import InferencePage from '../pages/Inference'
import LoginPage from '../pages/Login/LoginPage'
import ProfilePage from '../pages/Profile'
import QueryPage from '../pages/Query'
import Results from '../pages/Results'
import Result from '../pages/Results/Result'
import ProtectedRoute from './ProtectedRoutes'
// import PublicRoute from './PublicRoute'

export default function AppRouter() {
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			{/* Same as */}
			<ToastContainer />
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					// path="*"
					element={<ProtectedRoute component={<MainLayout />} />}
				>
					<Route index element={<Home />} />
					<Route path="/galleries" element={<Galleries />} />
					<Route path="/galleries/videos" element={<GalleryVideos />} />
					<Route path="/galleries/:galleryId" element={<Gallery />} />
					<Route path="/queries" element={<QueryPage />} />
					<Route path="/results" element={<Results />} />
					<Route path="/results/:resultId" element={<Result />} />
					<Route path="/inference" element={<InferencePage />} />
					<Route path="/about-us" element={<AboutUs />} />
					<Route path="/employees" element={<Employees />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Route>
			</Routes>
		</>
	)

	// return (
	// 	<Routes>
	// 		<Route
	// 			path="/login"
	// 			element={<PublicRoute user={user} component={<LoginPage />} />}
	// 		/>
	// 		<Route
	// 			path="/"
	// 			element={<ProtectedRoute user={user} component={<Home />} />}
	// 		/>
	// 		<Route
	// 			path="/home"
	// 			element={<ProtectedRoute user={user} component={<Home />} />}
	// 		/>
	// 		<Route
	// 			path="/galleries"
	// 			element={<ProtectedRoute user={user} component={<Galleries />} />}
	// 		/>
	// 		<Route
	// 			path="/galleries/:galleryId"
	// 			element={<ProtectedRoute user={user} component={<Gallery />} />}
	// 		/>
	// 		<Route
	// 			path="/queries"
	// 			element={<ProtectedRoute user={user} component={<QueryPage />} />}
	// 		/>
	// 		<Route
	// 			path="/results"
	// 			element={<ProtectedRoute user={user} component={<Results />} />}
	// 		/>
	// 		<Route
	// 			path="/results/:resultId"
	// 			element={<ProtectedRoute user={user} component={<Result />} />}
	// 		/>
	// 		<Route
	// 			path="/inference"
	// 			element={<ProtectedRoute user={user} component={<InferencePage />} />}
	// 		/>
	// 		<Route
	// 			path="/about-us"
	// 			element={<ProtectedRoute user={user} component={<AboutUs />} />}
	// 		/>
	// 		<Route
	// 			path="/employees"
	// 			element={<ProtectedRoute user={user} component={<Employees />} />}
	// 		/>
	// 		<Route
	// 			path="/profile"
	// 			element={<ProtectedRoute user={user} component={<ProfilePage />} />}
	// 		/>
	// 	</Routes>
	// )
}
