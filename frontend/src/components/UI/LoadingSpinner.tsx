export default function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div
				className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"
				role="status"
			></div>
			<span
				className="absolute w-px h-px -m-px p-0 overflow-hidden border-0"
				style={{ clip: 'rect(0, 0, 0, 0)' }}
			>
				Loading...
			</span>
		</div>
	)
}
