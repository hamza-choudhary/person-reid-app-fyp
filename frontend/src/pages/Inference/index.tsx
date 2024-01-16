import axios from 'axios'
import { useEffect, useState } from 'react'
import Button from '../../components/UI/Button'
import GallerySelection from './components/GallerySelection'
import ImageResults from './components/ImageResults'
import QuerySelection from './components/QuerySelection'

import socketIOClient from 'socket.io-client'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const SOCKET_SERVER_URL = 'http://localhost:8080'

interface QueryItem {
	_id: string
	image: string
	name: string
	description?: string
	createdAt?: string
}

interface GalleryItem {
	_id: string
	createdAt: Date
}

// Extend GalleryItem for image and video
interface GalleryImageItem extends GalleryItem {
	size: number
	image: string
}

interface GalleryVideoItem extends GalleryItem {
	video: string
}

interface MyFormData {
	queryId: string
	galleryId: string
	galleryType: string
}

enum Step {
	SelectQuery,
	SelectGallery,
	ShowHelloWorld,
}

interface SelectedQueryInterface {
	imageName: string
	name: string
	description?: string
	createdAt?: string
}

export default function InferencePage() {
	const [imageResults, setImageResults] = useState<string[]>([])
	const [videoResults, setVideoResult] = useState<string>('')
	const [queries, setQueries] = useState<QueryItem[]>([])
	const [imageGalleries, setImageGalleries] = useState<GalleryImageItem[]>([])
	const [videoGalleries, setVideoGalleries] = useState<GalleryVideoItem[]>([])
	const [error, setError] = useState<string>('')

	const [currentStep, setCurrentStep] = useState<Step>(Step.SelectQuery)
	const [selectedQuery, setSelectedQuery] = useState<SelectedQueryInterface>({
		imageName: '',
		name: '',
		description: '',
		createdAt: '',
	})
	const [formData, setFormData] = useState<MyFormData>({
		queryId: '',
		galleryId: '',
		galleryType: '',
	})

	const handleSubmit = async () => {
		try {
			let url: string
			if (formData.galleryType === 'image') {
				url = 'http://localhost:8080/api/results/image'
			} else if (formData.galleryType === 'video') {
				url = 'http://localhost:8080/api/results/video'
			} else {
				console.log('error: galleryType is wrong')
				return
			}

			const response = await axios.post(
				url,
				{
					queryId: formData.queryId,
					galleryId: formData.galleryId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			console.log('Upload successful', response.data)
		} catch (error) {
			//FIME: handle success and error
			console.error('Upload failed', error)
		}
	}

	const handleContinue = () => {
		if (currentStep === Step.SelectQuery && formData.queryId) {
			setCurrentStep(Step.SelectGallery)
			const query = queries.find((query) => query._id === formData.queryId)

			let date
			if (query?.createdAt) {
				const options: Intl.DateTimeFormatOptions = {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				}
				date = new Date(query?.createdAt)
					.toLocaleString('en-US', options)
					.replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/, '$2/$1/$3 $4')
			}

			setSelectedQuery({
				imageName: query?.image || '', // assuming query has an `image` property, replace "" with a default value if needed
				name: query?.name || '',
				description: query?.description || '',
				createdAt: date || '',
			})
		} else if (currentStep === Step.SelectGallery && formData.galleryId) {
			setCurrentStep(Step.ShowHelloWorld)
			handleSubmit()
		}
	}

	const handleBack = () => {
		if (currentStep === Step.SelectGallery) {
			setCurrentStep(Step.SelectQuery)
			setFormData({ ...formData, galleryId: '' })
		}
	}

	useEffect(() => {
		const fetchQueries = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/queries')
				if (response.data.status !== 'ok') {
					throw new Error('Failed to fetch queries')
				}
				setQueries(response.data.data)
			} catch (err) {
				setError('Error fetching queries')
			}
		}

		const fetchImageGalleries = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/galleries')
				if (response.data.status !== 'ok') {
					throw new Error('Failed to fetch image galleries')
				}
				const { data }: { data: GalleryImageItem[] } = response.data

				setImageGalleries(data)
			} catch (err) {
				setError('Error fetching image galleries')
			}
		}

		const fetchVideoGalleries = async () => {
			try {
				const response = await axios.get(
					'http://localhost:8080/api/galleries/videos'
				)
				if (response.data.status !== 'ok') {
					throw new Error('Failed to fetch video galleries')
				}

				const { data }: { data: GalleryVideoItem[] } = response.data

				setVideoGalleries(data)
			} catch (err) {
				setError('Error fetching galleries')
			}
		}

		fetchQueries()
		fetchImageGalleries()
		fetchVideoGalleries()
	}, [])

	useEffect(() => {
		//TODO: fix socket on condition formData.GalleryType
		const socket = socketIOClient(SOCKET_SERVER_URL)

		if (formData.galleryType === 'image') {
			socket.on('newImage', (imageName: string) => {
				console.log(imageName)
				setImageResults((prevResults) => [...prevResults, imageName])
			})
		} else if (formData.galleryType === 'video') {
			socket.on('newImage', (image: string) => {
				console.log(image)
				setVideoResult(image)
			})
		}

		return () => {
			socket.off('newImage')
		}
	}, [formData.galleryType])

	return (
		<>
			{error ? (
				<p>Error: {error}</p>
			) : (
				<>
					{currentStep !== Step.ShowHelloWorld && (
						<div className="flex justify-center items-center gap-6 mb-8">
							{currentStep !== Step.SelectQuery && (
								<Button
									className="font-medium bg-yellow-400 w-40 py-3"
									onClick={handleBack}
								>
									Back
								</Button>
							)}

							{(currentStep === Step.SelectQuery && formData.queryId) ||
							(currentStep === Step.SelectGallery && formData.galleryId) ? (
								<Button
									className="font-medium w-40 py-3"
									onClick={handleContinue}
								>
									Continue
								</Button>
							) : (
								<Button
									className="font-medium w-40 py-3 bg-slate-400 cursor-not-allowed"
									disabled={true}
								>
									Continue
								</Button>
							)}
						</div>
					)}

					{currentStep === Step.SelectQuery && (
						<QuerySelection
							queries={queries}
							formData={formData}
							setFormData={setFormData}
						/>
					)}

					{currentStep === Step.SelectGallery && (
						<GallerySelection
							galleries={imageGalleries}
							videoGalleries={videoGalleries}
							formData={formData}
							setFormData={setFormData}
						/>
					)}

					{currentStep === Step.ShowHelloWorld && (
						<ImageResults
							query={selectedQuery}
							setCurrentStep={setCurrentStep}
						/>
					)}
					{(imageResults.length || videoResults) && (
						<h2 className="mt-4 text-xl font-medium">Results</h2>
					)}
					{imageResults && (
						<div className="flex gap-5 flex-wrap">
							{imageResults.map((result) => (
								<img
									className="w-48 h-48"
									key={result}
									src={`http://localhost:8080/uploads/results/${result}`}
									alt=""
								/>
							))}
						</div>
					)}
					{videoResults && (
						<div className="flex justify-center items-center">
							<img
								className="object-contain object-center max-w-[50rem] max-h-[80vh]"
								src={`data:image/jpeg;base64,${videoResults}`}
								alt="video-streaming"
							/>
						</div>
					)}
					{!imageResults?.length && !videoResults && 
							<LoadingSpinner/>
					}
				</>
			)}
		</>
	)
}
