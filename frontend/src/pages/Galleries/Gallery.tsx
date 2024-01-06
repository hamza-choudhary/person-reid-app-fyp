import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResponsiveDrawer from '../../components/Sidebar'
import UploadImages from '../../components/UploadImages/UploadImages'

export default function Gallery() {
	type GalleryItem = {
		_id: string
		size: number
		image: string
		createdAt: Date
	}

	const { galleryId } = useParams()
	const [gallery, setGallery] = useState<GalleryItem[]>([])

	const uploadGalleryHandler = async (formData: FormData) => {
		const newFormData = new FormData()

		for (const [key, value] of formData.entries()) {
			if (key === 'files') {
				// Change key from 'files' to 'gallery'
				newFormData.append('gallery', value)
			} else {
				// Append other entries as is
				newFormData.append(key, value)
			}
		}
		//FIXME: add user id from authcontext
		newFormData.append('userId', '6596c0531239ec6b70de7948')
		try {
			const response = await axios.post(
				'http://localhost:8080/api/upload/gallery',
				newFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			console.log(response)
		} catch (error) {
			//FIXME:L handle error and success
			console.log(error)
		}
	}

	useEffect(() => {
		const sendReq = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/')
				if (response.data.status !== 'ok') {
					throw new Error('galleries are not fetched')
				}

				const { data }: { data: GalleryItem[] } = response.data
				setGallery(data)
			} catch (error) {
				//FIXME: handle error and success
				console.log(error)
			}
		}

		sendReq()
	}, [])

	return (
		<>
			<ResponsiveDrawer className="p-4">
				<div className="flex justify-end mb-4">
					<UploadImages
						className="text-lg"
						onSubmit={uploadGalleryHandler}
						buttonTxt="create new gallery"
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
					{gallery &&
						gallery.map((gallery) => (
							<img
								key={gallery._id}
								className="object-cover object-center w-full h-56 max-w-full rounded-lg"
								src={`http://localhost:8080/uploads/gallery/${gallery.image}`}
							/>
						))}
				</div>
			</ResponsiveDrawer>
		</>
	)
}
