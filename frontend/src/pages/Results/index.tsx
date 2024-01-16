import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal/Modal'

type ResultsItem = {
	_id: string
	queryId: string
	name: string
	resultImage?: string
	resultVideo?: string
	createdAt?: Date
	size?: number
}
export default function Results() {
	const navigate = useNavigate()
	const [showModal, setShowModal] = useState(false)
	const [results, setResults] = useState<ResultsItem[]>([])
	const [deleteResultId, setDeleteResultId] = useState('')

	const deleteResultHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/results/${deleteResultId}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			if (response.data.status !== 'ok') {
				throw new Error('unable to send delete request to api!')
			}

			setResults((prev) =>
				prev.filter((result) => result._id !== deleteResultId)
			)
			setShowModal(false)
			toast.success('Results are deleted successfully')
		} catch (error) {
			console.log(error)
			toast.error('Results are not deleted')
		}
	}

	useEffect(() => {
		const sendReq = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/results')
				if (response.data.status !== 'ok') {
					throw new Error('unable to fetch results!')
				}

				const { data }: { data: ResultsItem[] } = response.data
				setResults(data)
			} catch (error) {
				console.log(error)
        toast.error("Unable to fetch results")
			}
		}

		sendReq()
	}, [])

	return (
		<>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
				{results &&
					results.map((result) => {
						let date
						if (result.createdAt) {
							const options: Intl.DateTimeFormatOptions = {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true,
							}
							date = new Date(result?.createdAt)
								.toLocaleString('en-US', options)
								.replace(
									/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/,
									'$2/$1/$3 $4'
								)
						}

						return (
							<div
								key={result._id}
								className="relative cursor-pointer"
								onClick={() => navigate(`/results/${result._id}`)}
							>
								{result.resultImage && (
									<img
										className="object-cover object-center w-full h-56 max-w-full rounded-lg"
										src={`http://localhost:8080/uploads/results/${result.resultImage}`}
									/>
								)}
								{result.resultVideo && (
									<video
										className="object-cover object-center w-full h-56 max-w-full rounded-lg"
										src={`http://localhost:8080/uploads/results/${result.resultVideo}`}
									></video>
								)}
								<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
									<div
										onClick={(event) => {
											event.stopPropagation()
											setShowModal(true)
											setDeleteResultId(result._id)
										}}
										title="delete gallery"
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
										<p className="text-white text-xl">{result.size} images</p>

										<p className="text-white">{date ? date : ''}</p>
									</div>
								</div>
							</div>
						)
					})}
			</div>
			<Modal showModal={showModal} setShowModal={setShowModal}>
				<form
					onSubmit={deleteResultHandler}
					className="lg:w-[30rem] p-6"
					method="POST"
				>
					<h1 className="font-bold text-3xl text-center text-black">
						Delete Result
					</h1>
					<p className="font-regular text-center mt-4 text-black">
						Are you sure you want to delete the results?
					</p>
					<button
						type="submit"
						className="mt-11 block border-0 w-full p-2 text-title-xsml bg-primary text-white font-semibold rounded-md"
					>
						Delete
					</button>
					<button
						type="button"
						onClick={() => setShowModal(false)}
						className="block border-0 w-full p-2 text-title-xsml bg-gray-200 text-primary mt-4 font-semibold rounded-md"
					>
						Cancel
					</button>
				</form>
			</Modal>
		</>
	)
}
