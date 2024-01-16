import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type QueryItem = {
	_id: string
	image: string
	name: string
	description?: string
	createdAt?: string
}

type GalleryVideoItem = {
	_id: string
	video: string
	createdAt: Date
}

interface CarosalProps {
	setShowCarosal: (showCarosal: boolean) => void
	showCarosal: boolean
	imageType: string
	images: string[] | QueryItem[] | GalleryVideoItem[]
	firstIndex: number
}

const Carosal: React.FC<CarosalProps> = ({
	imageType,
	images,
	showCarosal,
	setShowCarosal,
	firstIndex,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		setCurrentIndex(firstIndex)
	}, [firstIndex])

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : images.length - 1
		)
	}

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < images.length - 1 ? prevIndex + 1 : 0
		)
	}

	if (!showCarosal) return null
	if (
		imageType !== 'query' &&
		imageType !== 'video' &&
		imageType !== 'gallery' &&
		imageType !== 'results'
	)
		return null

	return createPortal(
		<>
			<div
				className="flex justify-center items-center overflow-x-hidden fixed inset-0 z-[1203]"
				onClick={() => setShowCarosal(false)}
			>
				<div className="relative"></div>
				{/* Image */}
				<div className="z-[1201]" onClick={(e) => e.stopPropagation()}>
					{(imageType === 'gallery' || imageType === 'results') && (
						<img
							className="object-contain object-center max-h-[95vh] max-w-[80vw]"
							src={`http://localhost:8080/uploads/${imageType}/${images[currentIndex]}`}
							alt="Carousel Image"
						/>
					)}
					{imageType === 'query' && (
						<QueryCarosal query={images[currentIndex] as QueryItem} />
					)}
					{imageType === 'video' && (
						<VideoCarosal
							galleryVideo={images[currentIndex] as GalleryVideoItem}
						/>
					)}
				</div>
				{/* Buttons */}
				<div
					className="absolute z-[1204] w-[85vw] h-auto flex justify-between items-center"
					onClick={(e) => e.stopPropagation()}
				>
					<CarosalButton action="back" goTo={goToPrevious} />
					<CarosalButton action="next" goTo={goToNext} />
				</div>

				{/* Background overlay */}
				<div
					className={`${
						imageType === 'query' ? 'opacity-90' : 'opacity-30'
					} fixed inset-0 bg-black`}
				></div>
			</div>
			,
		</>,
		document.getElementById('carosal-root') as HTMLElement
	)
}

export default Carosal

interface ForwardButtonProps {
	goTo: () => void
	action: string
}

function CarosalButton({ goTo, action }: ForwardButtonProps) {
	if (action !== 'next' && action !== 'back') {
		return null
	}
	return (
		<button onClick={goTo} className="p-2 rounded-full opacity-90 bg-slate-500">
			{action === 'next' && (
				<svg
					className="w-8 h-8 text-white"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M9 5l7 7-7 7"></path>
				</svg>
			)}

			{action === 'back' && (
				<svg
					className="w-8 h-8 text-white"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M15 19l-7-7 7-7"></path>
				</svg>
			)}
		</button>
	)
}

function QueryCarosal({ query }: { query: QueryItem }) {
	return (
		<div className="flex justify-center">
			<img
				className="object-contain object-right max-h-[95vh] max-w-[60rem]"
				src={`http://localhost:8080/uploads/query/${query.image}`}
				alt="Carousel Image"
			/>
			<div className="flex flex-col pl-4 w-[25rem] bg-zinc-400 bg-opacity-40 text-white">
				<h2 className="font-semibold text-lg">Name: </h2>
				<p>{query.name}</p>

				{query.createdAt && (
					<>
						<h2 className="font-semibold text-lg">Created At: </h2>
						<p>{query.createdAt}</p>
					</>
				)}
				{query.description && (
					<>
						<h2 className="font-semibold text-lg">Description: </h2>
						<p className="overflow-y-auto max-h-[60vh]">{query.description}</p>
					</>
				)}
			</div>
		</div>
	)
}

function VideoCarosal({ galleryVideo }: { galleryVideo: GalleryVideoItem }) {
	return (
		<video
			className="object-contain object-center max-h-[95vh] max-w-[80vw]"
			src={`http://localhost:8080/uploads/gallery/${galleryVideo.video}`}
			controls
		></video>
	)
}
