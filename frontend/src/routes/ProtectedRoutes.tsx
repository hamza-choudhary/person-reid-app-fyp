import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

type User = {
	_id: string
	name: string
	email: string
	role: string
	phone: string
	cnic: string
}

interface ProtectedRouteProps {
	user: User | null
	component: ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	user,
	component,
}): ReactElement => {
	//FIXME: add proper roles
	if (user?.role !== 'admin' && user?.role !== 'guard') {
		return <Navigate to="/login" replace />
	}
	return component
}

export default ProtectedRoute
