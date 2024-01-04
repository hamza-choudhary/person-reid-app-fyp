class CustomError extends Error {
	status?: number // Optional status property
	constructor(message: string) {
		super(message) // Call the super class constructor and pass in the message parameter
		Object.setPrototypeOf(this, CustomError.prototype)
	}
}

export function createError(message: string, status: number) {
	const error = new CustomError(message)
	error.status = status
	return error
}
