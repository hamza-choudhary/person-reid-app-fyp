import mongoose from 'mongoose'

mongoose
	.connect(process.env.MONGO_URI as string)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err))

mongoose.set('strictQuery', true)

export default mongoose.connection
