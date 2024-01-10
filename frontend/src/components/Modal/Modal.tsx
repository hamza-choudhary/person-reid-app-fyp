import { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
	showModal: boolean
	children: ReactNode
	setShowModal: (show: boolean) => void
	className?: string
}

const Modal: FC<ModalProps> = ({
	showModal,
	children,
	setShowModal,
	className = '',
}) => {
	if (!showModal) return null

	return createPortal(
		<>
			<div
				className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[1203] outline-none focus:outline-none"
				onClick={() => setShowModal(false)}
			>
				<div
					className={`my-6 mx-auto max-w-3xl max-h-[90vh] ${className} z-[1201]`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* card */}
					<div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
						{/* content */}
						{children}
					</div>
				</div>

				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
			</div>
		</>,
		document.getElementById('portal-root') as HTMLElement
	)
}

export default Modal
