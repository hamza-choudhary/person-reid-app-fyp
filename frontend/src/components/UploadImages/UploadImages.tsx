import React, { FC, useCallback, useState } from 'react'
import Modal from '../Modal/Modal'
import Button from '../UI/Button'
import DragAndDrop from '../UI/DragAndDrop'

interface UploadImagesProps {
	className?: string
	buttonTxt?: string
	fileTye: string
	onSubmit: (formData: FormData) => void
}

type FileType = 'image' | 'video'

const UploadImages: FC<UploadImagesProps> = ({
	className = '',
	buttonTxt = 'upload images',
	fileTye = 'image',
	onSubmit,
}) => {
	const [showModal, setShowModal] = useState(false)
	const [formData, setFormData] = useState<FormData>(new FormData())

	const dragAndDropChangeHandler = useCallback((newFormData: FormData) => {
		setFormData(newFormData)
	}, [])

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		onSubmit(formData)
		setShowModal(false)
	}

	return (
		<>
			<Button className={className} onClick={() => setShowModal(true)}>
				<span className="inline-flex items-center">
					<svg
						style={{ height: '1.2rem', width: '1.2rem', fill: 'white' }}
						xmlns="http://www.w3.org/2000/svg"
						enableBackground="new 0 0 512 512"
						viewBox="0 0 512 512"
						id="plus"
					>
						<path
							d="M468.3,212.7H305.2v-169c0-24.2-19.6-43.8-43.8-43.8c-24.2,0-43.8,19.6-43.8,43.8v169h-174
	C19.6,212.7,0,232.3,0,256.5c0,24.2,19.6,43.8,43.8,43.8h174v168c0,24.2,19.6,43.8,43.8,43.8c24.2,0,43.8-19.6,43.8-43.8v-168h163.1
	c24.2,0,43.8-19.6,43.8-43.8C512,232.3,492.5,212.7,468.3,212.7z"
						></path>
					</svg>
					<span className="pl-1">{buttonTxt}</span>
				</span>
			</Button>
			<Modal
				showModal={showModal}
				setShowModal={setShowModal}
				className="w-[50rem]"
			>
				<form
					method="POST"
					className="flex flex-col px-2 pb-2"
					onSubmit={submitHandler}
				>
					<button
						className="self-end pt-1 hover:bg-blue-300"
						onClick={() => setShowModal(false)}
					>
						<svg
							className="w-6 h-6"
							xmlns="http://www.w3.org/2000/svg"
							data-name="Layer 1"
							viewBox="0 0 64 64"
							id="cross"
						>
							<line
								x1="9.37"
								x2="54.63"
								y1="9.37"
								y2="54.63"
								fill="none"
								stroke="#010101"
								strokeMiterlimit="10"
								strokeWidth="4"
							></line>
							<line
								x1="9.37"
								x2="54.63"
								y1="54.63"
								y2="9.37"
								fill="none"
								stroke="#010101"
								strokeMiterlimit="10"
								strokeWidth="4"
							></line>
						</svg>
					</button>
					<DragAndDrop
						fileType={fileTye as FileType}
						onChange={dragAndDropChangeHandler}
					/>
					<div className="self-end mt-2">
						<Button className="text-base" type="submit">
							submit
						</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}

export default UploadImages
