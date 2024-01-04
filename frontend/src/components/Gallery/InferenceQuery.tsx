import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import styles from './style.module.css'

const InferenceQuery = () => {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(!open)
	const [images, setImages] = useState([])

	const [selectedOption, setSelectedOption] = useState('')

	// Handler for radio button change
	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(event.target.value)
	}

	const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log(selectedOption)
		try {
			const response = await axios.post(
				'http://localhost:8080/api/inference',
				{
					query: selectedOption,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			console.log(response.data)
		} catch (error) {
			console.error('There was an error!', error)
		}
	}

	useEffect(() => {
		// Fetch images when the component mounts
		axios
			.get('http://localhost:8080/api/images/query')
			.then((response) => {
				setImages(response.data.data)
			})
			.catch((error) => {
				console.log('There was an error fetching the images:', error)
			})
	}, [])

	return (
		<Box className="queryCardMain">
			<Heading
				text="Inference"
				textAlign="center"
				margin="0px 0px 30px"
				color="text.secondary"
			></Heading>
			<Card>
				<CardContent>
					<form
						className={styles.hiddenradio}
						onSubmit={submitHandler}
						method="post"
					>
						<Box
							// container
							className="previousQueryDataMainFlex"
							sx={{ textAlign: 'right' }}
							// columnSpacing={2}
						>
							<Box className="previousQueryDataRight">
								<Box>
									<Button
										component="label"
										variant="contained"
										onClick={handleOpen}
									>
										Select Query Image
										{/* <VisuallyHiddenInput
                    type="file"
                    onChange={(e: any) =>
                      setSelectedFile(URL.createObjectURL(e.target.files[0]))
                    }
                  /> */}
									</Button>
								</Box>
							</Box>
							{open && (
								<Box className="previousQueryDataLeft" sx={{ mt: '20px' }}>
									<Grid
										container
										className="previouosQueryDataLeftFlex"
										rowSpacing={{ md: 2, xs: 1 }}
										columnSpacing={{ md: 2, xs: 1 }}
									>
										{/* label selection */}
										{images &&
											images.map((image: string, index) => {
												const parts = image.split('-')
												const name = parts[1]
												return (
													<Grid item xs={2.4}>
														<label key={image}>
															<input
																type="radio"
																name="image"
																value={image}
																onChange={handleRadioChange}
																checked={selectedOption === image}
															/>
															<img
																src={`http://localhost:8080/uploads/query/${image}`}
																alt={`Option ${index + 1}`}
															/>
														</label>
														<Typography
															variant="h6"
															sx={{
																textAlign: 'center',
																textTransform: 'capitalize',
															}}
														>
															{name}
														</Typography>
													</Grid>
												)
											})}
									</Grid>
								</Box>
							)}
							<Box sx={{ textAlign: 'center', mt: '20px' }}>
								<Button type="submit">
									Make Predictions
									{/* <VisuallyHiddenInput
                    type="file"
                    onChange={(e: any) =>
                      setSelectedFile(URL.createObjectURL(e.target.files[0]))
                    }
                  /> */}
								</Button>
							</Box>
						</Box>
					</form>
				</CardContent>
			</Card>
		</Box>
	)
}

export default InferenceQuery
