import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Modal,
	Typography,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Heading from '../Heading'
import QueryModal from './QueryModal'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: { lg: 500, md: 400, xs: '90%' },
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
}

const Query = () => {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const [images, setImages] = useState([])

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
				text="Query An Image"
				textAlign="center"
				margin="0px 0px 30px"
				color="text.secondary"
			></Heading>
			<Card>
				<CardContent>
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
									Upload New Query Image
									{/* <VisuallyHiddenInput
                    type="file"
                    onChange={(e: any) =>
                      setSelectedFile(URL.createObjectURL(e.target.files[0]))
                    }
                  /> */}
								</Button>
								<Modal
									open={open}
									onClose={handleClose}
									aria-labelledby="modal-modal-title"
									aria-describedby="modal-modal-description"
								>
									<Box sx={style}>
										<QueryModal />
									</Box>
								</Modal>
							</Box>
						</Box>
						<Box className="previousQueryDataLeft" sx={{ mt: '20px' }}>
							<Grid
								container
								className="previouosQueryDataLeftFlex"
								rowSpacing={{ md: 2, xs: 1 }}
								columnSpacing={{ md: 2, xs: 1 }}
							>
								{images &&
									images.map((image: string) => {
										const parts = image.split('-')
										const name = parts[1]
										return (
											<Grid key={image} item xs={6} md={3}>
												<Box
													component="img"
													sx={{ height: '300px' }}
													src={`http://localhost:8080/uploads/query/${image}`}
												/>
												<Typography
													variant="h6"
													textAlign="center"
													color="text.secondary"
												>
													{name}
												</Typography>
											</Grid>
										)
									})}
							</Grid>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	)
}

export default Query
