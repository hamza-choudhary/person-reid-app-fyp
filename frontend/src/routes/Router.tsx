import { Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AboutUs from '../pages/AboutUs'
import Employees from '../pages/Employees/Employees'
import Galleries from '../pages/Galleries'
import Gallery from '../pages/Galleries/Gallery'
import Home from '../pages/Home'
import InferencePage from '../pages/Inference'
import LoginPage from '../pages/Login/LoginPage'
import ProfilePage from '../pages/Profile'
import QueryPage from '../pages/Query'
import Results from '../pages/Results'
import Result from '../pages/Results/Result'
import ProtectedRoute from './ProtectedRoutes'
import PublicRoute from './PublicRoute'

export default function AppRouter() {
	const { user } = useAuth().state

	return (
		<Routes>
			<Route
				path="/login"
				element={<PublicRoute user={user} component={<LoginPage />} />}
			/>
			<Route
				path="/"
				element={<ProtectedRoute user={user} component={<Home />} />}
			/>
			<Route
				path="/home"
				element={<ProtectedRoute user={user} component={<Home />} />}
			/>
			<Route
				path="/galleries"
				element={<ProtectedRoute user={user} component={<Galleries />} />}
			/>
			<Route
				path="/galleries/:galleryId"
				element={<ProtectedRoute user={user} component={<Gallery />} />}
			/>
			<Route
				path="/queries"
				element={<ProtectedRoute user={user} component={<QueryPage />} />}
			/>
			<Route
				path="/results"
				element={<ProtectedRoute user={user} component={<Results />} />}
			/>
			<Route
				path="/results/:resultId"
				element={<ProtectedRoute user={user} component={<Result />} />}
			/>
			<Route
				path="/inference"
				element={<ProtectedRoute user={user} component={<InferencePage />} />}
			/>
			<Route
				path="/about-us"
				element={<ProtectedRoute user={user} component={<AboutUs />} />}
			/>
			<Route
				path="/employees"
				element={<ProtectedRoute user={user} component={<Employees />} />}
			/>
			<Route
				path="/profile"
				element={<ProtectedRoute user={user} component={<ProfilePage />} />}
			/>
		</Routes>
	)
}