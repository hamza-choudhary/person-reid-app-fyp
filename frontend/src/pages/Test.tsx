import { useCallback, useState } from 'react'
import Modal from '../components/Modal/Modal'
import Button from '../components/UI/Button'
import DragAndDrop from '../components/UI/DragAndDrop' // Import the DragAndDrop component

function YourFormComponent() {
	const [showModal, setShowModal] = useState(false)
	const [formData, setFormData] = useState<FormData>(new FormData())

	const dragAndDropChangeHandler = useCallback((newFormData: FormData) => {
		setFormData(newFormData)
	}, [])

	return (
		<>
			<button className="" onClick={() => setShowModal(true)}>
				Upload Images
			</button>
			<Modal
				showModal={showModal}
				setShowModal={setShowModal}
				className="w-4/6"
			>
				<form method="POST" className="flex flex-col px-2 pb-2">
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
					<DragAndDrop onChange={dragAndDropChangeHandler} />
					<div className="self-end mt-2">
						<Button className="text-base" type="submit">
							submit
						</Button>
					</div>
				</form>
			</Modal>
		</>
	)

	// return (
	// 	<div>
	// 		{/* Your form components */}
	// 		<DragAndDrop onChange={dragAndDropChangeHandler} />{' '}
	// 		<button onClick={() => {console.log(formData)}}>submit</button>
	// 		{/* <form>
	// 		</form> */}
	// 		{/* Use the DragAndDrop component */}
	// 		{/* Other form elements */}
	// 	</div>
	// )
}

export default YourFormComponent
