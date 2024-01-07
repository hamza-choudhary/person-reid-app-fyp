import axios from 'axios'
import { useEffect, useState } from 'react'
import ResponsiveDrawer from '../../components/Sidebar'
import GallerySelection from './components/GallerySelection'
import ImageResults from './components/ImageResults'
import QuerySelection from './components/QuerySelection'

interface QueryItem {
	_id: string
	image: string
	name: string
	description: string
}

interface GalleryItem {
	_id: string
	size: number
	image: string
	createdAt: Date
}
interface MyFormData {
	queryId: string
	galleryId: string
}

enum Step {
	SelectQuery,
	SelectGallery,
	ShowHelloWorld,
}

export default function InferencePage() {
	const [queries, setQueries] = useState<QueryItem[]>([])
	const [galleries, setGalleries] = useState<GalleryItem[]>([])
	const [error, setError] = useState<string>('')

	const [currentStep, setCurrentStep] = useState<Step>(Step.SelectQuery)
	const [formData, setFormData] = useState<MyFormData>({
		queryId: '',
		galleryId: '',
	})

	const handleSubmit = async () => {
		console.log(formData)
	}

	const handleContinue = () => {
		if (currentStep === Step.SelectQuery && formData.queryId) {
			setCurrentStep(Step.SelectGallery)
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

		const fetchGalleries = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/galleries')
				if (response.data.status !== 'ok') {
					throw new Error('Failed to fetch galleries')
				}
				setGalleries(response.data.data)
			} catch (err) {
				setError('Error fetching galleries')
			}
		}

		fetchQueries()
		fetchGalleries()
	}, [])

	return (
		<ResponsiveDrawer className="p-4">
			{error ? (
				<p>Error: {error}</p>
			) : (
				<>
					{currentStep === Step.SelectQuery && (
						<QuerySelection
							queries={queries}
							formData={formData}
							setFormData={setFormData}
						/>
					)}

					{currentStep === Step.SelectGallery && (
						<GallerySelection
							galleries={galleries}
							formData={formData}
							setFormData={setFormData}
						/>
					)}

					{currentStep === Step.ShowHelloWorld && (
						<ImageResults setCurrentStep={setCurrentStep} />
					)}

					{currentStep !== Step.ShowHelloWorld && (
						<div className="flex justify-between mt-4">
							{currentStep !== Step.SelectQuery && (
								<button
									className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
									onClick={handleBack}
								>
									Back
								</button>
							)}

							{(currentStep === Step.SelectQuery && formData.queryId) ||
							(currentStep === Step.SelectGallery && formData.galleryId) ? (
								<button
									className="bg-green-500 text-white font-bold py-2 px-4 rounded"
									onClick={handleContinue}
								>
									Continue
								</button>
							) : (
								<button
									className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
									disabled
								>
									Continue
								</button>
							)}
						</div>
					)}
				</>
			)}
		</ResponsiveDrawer>
	)
}
