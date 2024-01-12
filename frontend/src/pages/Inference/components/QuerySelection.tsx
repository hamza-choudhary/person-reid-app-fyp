import React from 'react'

interface QueryItem {
	_id: string
	image: string
	name: string
}

interface QuerySelectionProps {
	queries: QueryItem[]
	formData: { queryId: string; galleryId: string }
	setFormData: React.Dispatch<
		React.SetStateAction<{ queryId: string; galleryId: string, galleryType: string }>
	>
}

const QuerySelection: React.FC<QuerySelectionProps> = ({
	queries,
	formData,
	setFormData,
}) => {
	return (
		<>
			<h1 className="text-2xl font-bold">
				Select Query <span className="text-red-700">*</span>
			</h1>
			<div className="flex flex-wrap gap-2">
				{queries.map((query) => (
					<div
						key={query._id}
						className={`z-20 relative cursor-pointer rounded-lg ${
							formData.queryId === query._id
								? 'selected border-2 border-sky-700'
								: 'border-2 border-transparent'
						}`}
						onClick={() =>
							setFormData((prev) => ({ ...prev, queryId: query._id }))
						}
					>
						<img
							className="object-top object-scale-down rounded-sm max-h-[12rem] max-w-[12rem]"
							src={`http://localhost:8080/uploads/query/${query.image}`}
							alt={query.name}
						/>
						<div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
							<div className="flex flex-col justify-center items-center my-auto">
								<p className="text-white text-xl">{query.name}</p>
								<p className='text-white'>{query._id}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

export default QuerySelection
