import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ResponsiveDrawer from '../../components/Sidebar'

export default function Result() {
	type ResultItem = {
		_id: string
		queryId: string
		name: string
		description?: string
		queryImage: string
		resultImages: string[]
		createdAt?: string
	}

	const navigate = useNavigate()

	const { resultId } = useParams()
	const [result, setResult] = useState<ResultItem>({
		_id: '',
		queryId: '',
		name: '',
		queryImage: '',
		resultImages: [],
	})

	if (!resultId) {
		navigate('/404')
	}

	useEffect(() => {
		const sendReq = async () => {
			try {
				console.log(resultId)
				const response = await axios.get(
					`http://localhost:8080/api/results/${resultId}`
				)
				if (response.data.status !== 'ok') {
					throw new Error('unable to send req to fetch results')
				}

				const { data }: { data: ResultItem } = response.data

				const options: Intl.DateTimeFormatOptions = {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				}
				let date
				if (data.createdAt) {
					date = new Date(data.createdAt as string)
						.toLocaleString('en-US', options)
						.replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/, '$2/$1/$3 $4')
				}

				if (!data?.resultImages.length) {
					navigate('/404')
					return
				}

				setResult({ ...data, createdAt: date })
			} catch (error) {
				//FIXME: handle error and success
				console.log(`not fetching the ${resultId} `, error)
				navigate('/404')
				return
			}
		}

		sendReq()
	}, [resultId, navigate])

	return (
		<>
			<ResponsiveDrawer className="p-4">
				{result.resultImages.length ? (
					<>
						<div className="flex">
							<img
								className="max-w-80 object-top object-cover rounded-sm max-h-[30rem]"
								src={`http://localhost:8080/uploads/query/${result.queryImage}`}
								alt="query image"
							/>
							<div className="flex flex-col pl-8">
								<div className="flex items-center gap-4">
									<h2 className="font-semibold text-lg">Name: </h2>
									<p>{result.name}</p>
								</div>
								{result.createdAt && (
									<div className="flex items-center gap-4">
										<h2 className="font-semibold text-lg">Created At: </h2>
										<p>{result.createdAt}</p>
									</div>
								)}
								{result.description && (
									<div className="flex items-center gap-4">
										<h2 className="font-semibold text-lg">Description: </h2>
										<p>{result.description}</p>
									</div>
								)}
							</div>
						</div>
						<hr className="border-1 border-black px-10 my-5" />
						<h2 className="font-bold text-xl mb-4">Results:</h2>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
							{result?.resultImages &&
								result?.resultImages.map((image) => (
									<div
										key={image.substring(0, image.length - 4)}
										className="relative cursor-pointer"
									>
										<img
											className="object-cover object-center w-full h-56 max-w-full rounded-lg"
											src={`http://localhost:8080/uploads/results/${image}`}
										/>
										<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
											{/* <div className=" flex flex-col justify-center items-center my-auto">
											<p className="text-white text-xl">
												{gallery.size} images
											</p>
											<p>{date}</p>
										</div> */}
										</div>
									</div>
								))}
						</div>
					</>
				) : (
					<div>
						<h1 className="text-center font-semibold">No Results Found</h1>
					</div>
				)}
			</ResponsiveDrawer>
		</>
	)
}
