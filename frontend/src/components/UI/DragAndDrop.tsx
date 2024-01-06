import React, { useCallback, useEffect, useState } from 'react'

const formatFileSize = (size: number) => {
	if (size < 1024) return size + ' bytes'
	else if (size < 1048576) return (size / 1024).toFixed(2) + ' KB'
	else return (size / 1048576).toFixed(2) + ' MB'
}

interface FileWithPreview extends File {
	preview: string
}

interface DragAndDropProps {
	onChange: (formData: FormData) => void
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onChange }) => {
	const [files, setFiles] = useState<FileWithPreview[]>([])

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (event.dataTransfer.files) {
			handleFiles(event.dataTransfer.files)
		}
	}

	const handleFiles = useCallback((selectedFiles: FileList) => {
		const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB in bytes
		const imageFiles = Array.from(selectedFiles).filter((file) => {
			if (file.type.match('image.*')) {
				if (file.size > MAX_FILE_SIZE) {
					alert(`File size exceeds limit (${formatFileSize(MAX_FILE_SIZE)})`)
					return false
				}
				return true
			}
			return false
		})

		const mappedFiles = imageFiles.map((file) => {
			const fileWithPreview: FileWithPreview = Object.assign(file, {
				preview: URL.createObjectURL(file),
			})
			return fileWithPreview
		})

		setFiles((currentFiles) => [...currentFiles, ...mappedFiles])
	}, [])

	useEffect(() => {
		const createImageFormData = (imageFiles: FileWithPreview[]) => {
			const formData = new FormData()
			imageFiles.forEach((file) => formData.append('files', file))
			return formData
		}
		onChange(createImageFormData(files))
	}, [files, onChange])

	useEffect(() => {
		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview))
		}
	}, [files])

	const removeFile = useCallback((fileToRemove: FileWithPreview) => {
		URL.revokeObjectURL(fileToRemove.preview)
		setFiles((currentFiles) =>
			currentFiles.filter((file) => file !== fileToRemove)
		)
	}, [])

	return (
		<div
			className="relative flex flex-col p-4 text-sky-400 border-dashed border-2 border-sky-400 rounded"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<input
				accept="image/*"
				type="file"
				multiple
				className="absolute inset-0 z-10 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
				onChange={(e) => e.target.files && handleFiles(e.target.files)}
			/>

			<div className="flex flex-col items-center justify-center py-10 text-center">
				<svg
					className="w-6 h-6 mr-1 text-current-50"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p className="m-0">Drag your files here</p>
				<p className="leading-3">or</p>
				<button className="bg-sky-500 rounded-sm px-2 text-white mt-2 text-sm py-[1px]">
					select form device
				</button>
			</div>

			{files.length > 0 && (
				<div className="z-20 flex gap-1 flex-wrap">
					{files.map((file, index) => (
						<div
							key={index}
							className="relative max-w-40 flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded "
						>
							<img
								className="object-scale-down max-h-24 "
								src={file.preview}
								alt="Preview"
							/>
							<div className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
								<span className="font-bold text-gray-900 truncate">
									{file.name}
								</span>
								<span className="text-gray-900">
									{formatFileSize(file.size)}
								</span>
							</div>
							<button
								className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
								type="button"
								onClick={() => removeFile(file)}
							>
								<svg
									className="w-4 h-4 text-gray-700"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default DragAndDrop
