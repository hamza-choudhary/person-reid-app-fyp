import React, { useState } from 'react'

interface CarosalProps {
	onChange: (formData: FormData) => void
	multiple?: boolean
  imageType: string
  imageName: string
}

const Carosal: React.FC<CarosalProps> = ({ onChange, multiple = true, imageType, imageName }) => {
	return (
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
					src={`http://localhost:8080/uploads/${imageType}/${images[currentIndex]}`}
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
	)
}

export default Carosal
