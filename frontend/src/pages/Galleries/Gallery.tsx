import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import ResponsiveDrawer from '../../components/Sidebar'
import UploadImages from '../../components/UploadImages/UploadImages'
import './gallery.css'

export default function Gallery() {
	type GalleryItem = {
		_id: string | undefined
		images: string[] | []
	}

	const navigate = useNavigate()

	//FIXME: if gallery is empty then delete whole gallery

	const { galleryId } = useParams()
	const [showModal, setShowModal] = useState(false)
	const [deleteImgName, setDeleteImageName] = useState('')
	const [gallery, setGallery] = useState<GalleryItem>({
		_id: undefined,
		images: [],
	})

	const [showCarosal, setShowCarosal] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)

	const openModal = (index: number) => {
		setCurrentIndex(index)
		setShowCarosal(true)
	}

	const closeModal = () => {
		setShowCarosal(false)
	}

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : gallery.images.length - 1
		)
	}

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < gallery.images.length - 1 ? prevIndex + 1 : 0
		)
	}

	if (!galleryId) {
		navigate('/404')
	}

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
		newFormData.append('galleryId', galleryId ? galleryId : '')
		try {
			const response = await axios.put(
				'http://localhost:8080/api/gallery',
				newFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			if (response.data.status !== 'ok') {
				throw new Error('unable to send request to api!')
			}
			const { data } = response.data

			setGallery((prev) => ({ ...prev, images: data.images }))
		} catch (error) {
			//FIXME:L handle error and success
			console.log(error)
		}
	}

	const deleteGalleryImageHandler = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/galleries/${galleryId}/images/${deleteImgName}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			if (response.data.status !== 'ok') {
				throw new Error('request is not sending to api!')
			}

			setGallery((prev) => ({
				...prev,
				images: prev.images.filter((image) => image !== deleteImgName),
			}))

			setShowModal(false)

			if (response.data.data.images.length === 0) {
				navigate('/galleries')
			}
		} catch (error) {
			//FIXME: handle error and success
			console.log(error)
		}
	}

	useEffect(() => {
		const sendReq = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/api/galleries/${galleryId}`
				)
				if (response.data.status !== 'ok') {
					throw new Error('unable to send req to fetch gallery')
				}

				const { data }: { data: GalleryItem } = response.data
				setGallery(data)
			} catch (error) {
				//FIXME: handle error and success
				console.log(`not fetching the ${galleryId}`)
			}
		}

		sendReq()
	}, [galleryId])

	return (
		<>
			<ResponsiveDrawer className="p-4">
				<div className="flex justify-end mb-4">
					<UploadImages
						className="text-lg"
						onSubmit={uploadGalleryHandler}
						buttonTxt="add images"
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
					{gallery?.images &&
						gallery?.images.map((image, index) => (
							<div
								key={image.substring(0, image.length - 4)}
								className="relative cursor-pointer"
								onClick={() => openModal(index)}
							>
								<img
									className="object-cover object-center w-full h-56 max-w-full rounded-lg"
									src={`http://localhost:8080/uploads/gallery/${image}`}
								/>
								<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
									<div
										onClick={(event) => {
											event.stopPropagation()
											setShowModal(true)
											setDeleteImageName(image)
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
									{/* <div className=" flex flex-col justify-center items-center my-auto">
											<p className="text-white text-xl">
												{gallery.size} images
											</p>
											<p>{date}</p>
										</div> */}
								</div>
							</div>
						))}

					{showCarosal && (
						<div
							className="absolute w-screen h-screen inset-0 bg-red-500 bg-opacity-50 flex justify-center items-center z-[60]"
							onClick={closeModal}
						>
							<div
								className="bg-white p-4 rounded-lg max-w-4xl max-h-full w-4/5 h-4/5 flex justify-between items-center relative"
								onClick={(e) => e.stopPropagation()}
							>
								<button onClick={goToPrevious} className="focus:outline-none">
									<svg
										className="w-8 h-8 text-gray-800"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path d="M15 19l-7-7 7-7"></path>
									</svg>
								</button>
								<img
									className="object-contain w-full h-full transition-opacity duration-300 ease-in-out"
									src={`http://localhost:8080/uploads/gallery/${gallery.images[currentIndex]}`}
									alt=""
								/>
								<button onClick={goToNext} className="focus:outline-none">
									<svg
										className="w-8 h-8 text-gray-800"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path d="M9 5l7 7-7 7"></path>
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>

				<Modal showModal={showModal} setShowModal={setShowModal}>
					<form
						onSubmit={deleteGalleryImageHandler}
						className="lg:w-[30rem] p-6"
						method="POST"
					>
						<h1 className="font-bold text-3xl text-center text-black">
							Delete Gallery Image
						</h1>
						<p className="font-regular text-center mt-4 text-black">
							Are you sure you want to delete the image?
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
			</ResponsiveDrawer>
		</>
	)
}
