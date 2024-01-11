import mongoose from 'mongoose'

const Schema = mongoose.Schema

const gallerySchema = new Schema(
	{
		images: {
			type: [String],
		},
		video: {
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

const Gallery = mongoose.model('Gallery', gallerySchema)

export default Gallery
