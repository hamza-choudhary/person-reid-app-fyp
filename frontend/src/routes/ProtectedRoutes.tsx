import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

// type User = {
// 	_id: string
// 	name: string
// 	email: string
// 	role: string
// 	phone: string
// 	cnic: string
// }

interface ProtectedRouteProps {
	component: ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	component,
}): ReactElement => {
	const { user, loading } = useAuth().state

	if (loading) {
		return <LoadingSpinner />
	}

	// console.log('in protected routes ', user)
	//FIXME: add proper roles
	if (user?.role !== 'admin' && user?.role !== 'guard') {
		return <Navigate to="/login" replace />
	}
	return component
}

export default ProtectedRoute
