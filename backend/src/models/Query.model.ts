import mongoose from 'mongoose'

const Schema = mongoose.Schema

const querySchema = new Schema(
	{
		image: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

const Query = mongoose.model('Query', querySchema)

export default Query
