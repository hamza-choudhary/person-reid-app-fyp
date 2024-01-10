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

interface PublicRouteProps {
	user: User | null
	component: ReactElement
}

const PublicRoute: React.FC<PublicRouteProps> = ({
	user,
	component,
}): ReactElement => {
	if (user) {
		// Redirect to home if already logged in
		return <Navigate to="/" replace />
	}

	return component
}

export default PublicRoute
