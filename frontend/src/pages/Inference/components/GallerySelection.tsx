import React from 'react'

interface GalleryItem {
	_id: string
	size: number
	image: string
	createdAt: Date
}

interface GalleryProps {
	galleries: GalleryItem[]
	formData: { queryId: string; galleryId: string }
	setFormData: React.Dispatch<
		React.SetStateAction<{ queryId: string; galleryId: string }>
	>
}

const GallerySelection: React.FC<GalleryProps> = ({
	galleries,
	formData,
	setFormData,
}) => {
	return (
		<>
			<h1 className="text-2xl font-bold">
				Select Gallery <span className="text-red-700">*</span>
			</h1>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
				{galleries.map((gallery) => {
					const options: Intl.DateTimeFormatOptions = {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: true,
					}
					const date = new Date(gallery.createdAt)
						.toLocaleString('en-US', options)
						.replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/, '$2/$1/$3 $4')

					return (
						<div
							key={gallery._id}
							className={`z-20 relative cursor-pointer rounded-lg ${
								formData.galleryId === gallery._id
									? 'selected border-2 border-sky-700'
									: 'border-2 border-transparent'
							}`}
							onClick={() =>
								setFormData((prev) => ({
									...prev,
									galleryId: gallery._id,
								}))
							}
						>
							<img
								className="object-cover object-center w-full h-[10rem] max-w-full rounded-lg"
								src={`http://localhost:8080/uploads/gallery/${gallery.image}`}
							/>
							<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
								<div className="flex flex-col justify-center items-center my-auto">
									<p className="text-white text-xl">{gallery.size} images</p>
									<p className="text-white">{date}</p>
									<p className='text-white'>{gallery._id}</p>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default GallerySelection
