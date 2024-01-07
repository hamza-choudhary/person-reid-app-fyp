import React from 'react'

enum Step {
	SelectQuery,
	SelectGallery,
	ShowHelloWorld,
}

interface ImageResultsProps {
	setCurrentStep: React.Dispatch<React.SetStateAction<Step>>
}

const ImageResults: React.FC<ImageResultsProps> = ({ setCurrentStep }) => {
	// setCurrentStep(Step.SelectGallery)

	return (
		<>
			<div>hello world</div>
			<button onClick={() => setCurrentStep(Step.SelectQuery)}>
				start again
			</button>
		</>
	)
}

export default ImageResults
