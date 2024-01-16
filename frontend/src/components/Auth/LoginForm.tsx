import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Logo from '../../assets/logo.png'
import { useAuth } from '../../hooks/useAuth'
import Button from '../UI/Button'

const LoginForm = () => {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const navigate = useNavigate()

	const auth = useAuth()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!formData.email || !formData.password) {
			return toast.error('Must enter email and password')
		}
		if (auth) {
			try {
				await auth.login(formData.email, formData.password)
				toast.success('Successfully signed In!')
				navigate('/')
			} catch (error) {
				console.log(error)
				toast.error('Check Email or password')
			}
		}
	}

	return (
		<form
			onSubmit={submitHandler}
			method="POST"
			className="p-6 w-[25rem] bg-[#1C1D25] shadow-lg rounded-lg relative"
		>
			<div className="flex justify-around items-center">
				<img
					src={Logo}
					alt="logo"
					className="object-contain object-center w-28 h-28"
				/>
			</div>
			<div>
				<label className="inline-block my-2 font-medium text-white">
					Email
				</label>
				<input
					type="email"
					name="email"
					placeholder="hello@gmail.com"
					value={formData.email}
					onChange={handleChange}
					className="block w-full bg-transparent p-2 border border-gray rounded-md text-white"
					// required
				/>
			</div>
			<div>
				<label className="inline-block my-2 font-medium text-white">
					Password
				</label>
				<input
					type="password"
					name="password"
					placeholder="*******"
					minLength={3}
					value={formData.password}
					onChange={handleChange}
					className="block w-full bg-transparent p-2 border border-gray rounded-md text-white"
					// required
				/>
			</div>
			<div>
				<Button className="w-full p-2 my-6">Login</Button>
			</div>
		</form>
	)
}

export default LoginForm
