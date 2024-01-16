import axios from 'axios'

const API_URL = 'http://localhost:8080/auth'

type User = {
	_id: string
	name: string
	email: string
	role: string
	phone: string
	cnic: string
}

export const authService = {
	login: async (email: string, password: string) => {
		const response = await axios.post(
			`${API_URL}/login`,
			{ email, password },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		const { data, access_token }: { data: User; access_token: string } =
			response.data

		localStorage.setItem('access_token', access_token)
		return data
	},
	logout: async () => {
		await axios.post(`${API_URL}/logout`, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		localStorage.removeItem('access_token')
	},
}
