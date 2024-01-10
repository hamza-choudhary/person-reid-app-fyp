import axios from 'axios'
import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext<AuthContextType | null>(null)

type User = {
	_id: string
	name: string
	email: string
	role: string
	phone: string
	cnic: string
}

interface AuthState {
	isAuthenticated: boolean
	user: User | null
}

interface AuthContextType {
	state: AuthState
	login: (email: string, password: string) => Promise<void>
	logout: () => void
}

interface AuthProviderProps {
	children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [state, setState] = useState<AuthState>({
		isAuthenticated: false,
		user: null,
	})

	useEffect(() => {
		const validateToken = async () => {
			const token = localStorage.getItem('access_token')
			if (token) {
				try {
					const response = await axios.get(
						'http://localhost:8080/auth/user',
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
					const user = response.data.data
					setState({ isAuthenticated: true, user })
				} catch (error) {
					// Handle error
					localStorage.removeItem('access_token')
					setState({ isAuthenticated: false, user: null })
				}
			}
		}

		validateToken()
	}, [])

	const login = async (email: string, password: string) => {
		const user = await authService.login(email, password)
		setState({ isAuthenticated: true, user })
	}

	const logout = () => {
		authService.logout()
		setState({ isAuthenticated: false, user: null })
	}

	return (
		<AuthContext.Provider value={{ state, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
