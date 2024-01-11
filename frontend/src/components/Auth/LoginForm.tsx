import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
		if (auth) {
			try {
				await auth.login(formData.email, formData.password)
				navigate('/')
			} catch (error) {
				console.log(error)
				//FIXME: handle
			}
		}
	}

	return (
		<form onSubmit={submitHandler} method="POST" className="p-6 w-[25rem] bg-white shadow-lg">
			<div className='flex justify-around items-center'>

      <img
				src={Logo}
				alt="logo"
				className="object-contain object-center w-28 h-28"
			/>
      </div>
			<div>
				<label className="inline-block my-2 font-medium">Email</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="block w-full bg-transparent p-2 border border-gray rounded-md"
					required
				/>
			</div>
			<div>
				<label className="inline-block my-2 font-medium">Password</label>
				<input
					type="password"
					name="password"
					minLength={3}
					value={formData.password}
					onChange={handleChange}
					className="block w-full bg-transparent p-2 border border-gray rounded-md"
					required
				/>
			</div>
			<div>
				<Button className="w-full p-2 my-6">Login</Button>
			</div>
		</form>
	)
}

export default LoginForm
