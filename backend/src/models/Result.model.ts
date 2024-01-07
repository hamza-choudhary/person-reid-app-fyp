import mongoose from 'mongoose'

const Schema = mongoose.Schema

const resultSchema = new Schema(
	{
		queryId: {
			type: Schema.Types.ObjectId,
			ref: 'Query',
			required: true,
		},
		images: {
			type: [String],
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

const Result = mongoose.model('Result', resultSchema)

export default Result

