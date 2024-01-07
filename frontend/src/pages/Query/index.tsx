import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import ResponsiveDrawer from '../../components/Sidebar'
import Button from '../../components/UI/Button'
import DragAndDrop from '../../components/UI/DragAndDrop'

//FIXME: add modal for description

export default function QueryPage() {
	type QueryItem = {
		_id: string
		image: string
		name: string
		description: string
	}

	const [showAddQueryModal, setShowAddQueryModal] = useState(false)
	const [showDeleteQueryModal, setShowDeleteQueryModal] = useState(false)
	const [deleteQueryId, setDeleteQueryId] = useState('')
	// const [deleteQueryId, setDeleteQueryId] = useState<string | undefined>()
	const [queries, setQueries] = useState<QueryItem[]>([])

	const [formData, setFormData] = useState<FormData>(new FormData())
	const [inputFields, setInputFields] = useState({
		name: '',
		description: '',
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setInputFields((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const dragAndDropChangeHandler = useCallback((dropdownFormData: FormData) => {
		const newFormData = new FormData()

		for (const [key, value] of dropdownFormData.entries()) {
			if (key === 'files') {
				// Change key from 'files' to 'gallery'
				newFormData.append('query', value)
			} else {
				// Append other entries as is
				newFormData.append(key, value)
			}
		}

		setFormData(newFormData)
	}, [])

	useEffect(() => {
		const sendReq = async () => {
			try {
				const response = await axios.get(
					'http://localhost:8080/api/all/queries'
				)
				if (response.data.status !== 'ok') {
					throw new Error('queries are not fetched')
				}

				const { data }: { data: QueryItem[] } = response.data
				setQueries(data)
			} catch (error) {
				//FIXME: handle error and success
				console.log(error)
			}
		}

		sendReq()
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const newFormData = new FormData()

			for (const [key, value] of formData.entries()) {
				newFormData.append(key, value)
			}

			newFormData.append('name', inputFields.name)
			newFormData.append('description', inputFields.description)
			newFormData.append('userId', '6596c0531239ec6b70de7948')

			const response = await axios.post(
				'http://localhost:8080/api/upload/query',
				newFormData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			)

			if (response.data.status !== 'ok') {
				throw new Error('unable to send upload request to api!')
			}

			const { data } = response.data
			const { _id, name, description, image } = data as QueryItem

			setQueries((prev) => [...prev, { _id, name, description, image }])

			setInputFields({ name: '', description: '' })
			setShowAddQueryModal(false)
		} catch (error) {
			//FIXME: handle error and success
			console.log(error, 'in handle submit')
		}
	}

	const deleteQueryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const response = await axios.delete(
				'http://localhost:8080/api/delete/query',
				{
					data: {
						queryId: deleteQueryId,
					},
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			if (response.data.status !== 'ok') {
				throw new Error('something wrong with delete query api!')
			}

			setQueries((prev) => prev.filter((query) => query._id !== deleteQueryId))
			setShowAddQueryModal(false)
			setShowDeleteQueryModal(false)
		} catch (error) {
			//FIXME: handle error and success
			console.log(error)
		}
	}

	return (
		<>
			<ResponsiveDrawer className="p-4">
				<div className="flex justify-end mb-4">
					<Button onClick={() => setShowAddQueryModal(true)}>Add Query</Button>
				</div>

				<div className="columns-1 md:gap-2 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 ">
					{queries &&
						queries.map((query, index) => (
							<div key={query._id} className="relative cursor-pointer">
								<img
									className={`object-top object-cover rounded-sm max-h-[30rem] ${
										index !== 0 ? 'mt-2' : ''
									}`}
									src={`http://localhost:8080/uploads/query/${query.image}`}
								/>
								<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
									<div
										onClick={(event) => {
											event.stopPropagation()
											setShowDeleteQueryModal(true)
											setDeleteQueryId(query._id)
										}}
										title="delete query"
										className="self-end p-1 hover:rounded-full hover:bg-red-800 hover:bg-opacity-35 "
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="#DC2626"
											width="24"
											height="24"
											id="bin"
										>
											<path d="M9 3H7c0-1.7 1.3-3 3-3v2c-.6 0-1 .4-1 1zm8 0h-2c0-.6-.4-1-1-1V0c1.7 0 3 1.3 3 3zm0 3H7V3h2v1h6V3h2zm-7-6h4v2h-4z"></path>
											<path d="M21 6H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1zm-2 18H5c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1zM6 22h12V10H6v12z"></path>
											<path d="M10 20c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1zm4 0c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1z"></path>
										</svg>
									</div>
									<div className=" flex flex-col justify-center items-center my-auto">
										<p className="text-white text-xl">{query.name}</p>
										{/* <p>{date}</p> */}
									</div>
								</div>
							</div>
						))}
				</div>
				<Modal
					showModal={showAddQueryModal}
					setShowModal={setShowAddQueryModal}
				>
					<form
						onSubmit={handleSubmit}
						method="POST"
						className="lg:w-[40rem] p-6"
					>
						<h1 className="font-bold text-3xl text-center">Add Query</h1>
						<div>
							<label className="inline-block my-2 font-medium">Name</label>
							<input
								type="text"
								name="name"
								value={inputFields.name}
								onChange={handleChange}
								className="block w-full bg-transparent p-2 border border-gray rounded-md"
								required
							/>
						</div>
						<div>
							<label className="inline-block my-2 font-medium">
								Description
							</label>
							<textarea
								name="description"
								value={inputFields.description}
								onChange={handleChange}
								className="block w-full bg-transparent p-2 border border-gray rounded-md"
							></textarea>
						</div>
						<div>
							<label className="inline-block my-2 font-medium">Image</label>
							<DragAndDrop
								onChange={dragAndDropChangeHandler}
								multiple={false}
							/>
						</div>

						<button
							type="submit"
							className="mt-11 block border-0 w-full p-2 text-title-xsml bg-primary text-white font-semibold rounded-md"
						>
							Upload
						</button>
						<button
							type="button"
							onClick={() => setShowAddQueryModal(false)}
							className="block border-0 w-full p-2 text-title-xsml bg-gray-200 text-primary mt-4 font-semibold rounded-md"
						>
							Cancel
						</button>
					</form>
				</Modal>
				<Modal
					showModal={showDeleteQueryModal}
					setShowModal={setShowDeleteQueryModal}
				>
					<form
						onSubmit={deleteQueryHandler}
						className="lg:w-[30rem] p-6"
						method="POST"
					>
						<h1 className="font-bold text-3xl text-center text-black">
							Delete Query
						</h1>
						<p className="font-regular text-center mt-4 text-black">
							Note: By deleting query all its results will also be lost!
						</p>
						<button
							type="submit"
							className="mt-11 block border-0 w-full p-2 text-title-xsml bg-primary text-white font-semibold rounded-md"
						>
							Delete
						</button>
						<button
							type="button"
							onClick={() => setShowDeleteQueryModal(false)}
							className="block border-0 w-full p-2 text-title-xsml bg-gray-200 text-primary mt-4 font-semibold rounded-md"
						>
							Cancel
						</button>
					</form>
				</Modal>
			</ResponsiveDrawer>
		</>
	)
}
