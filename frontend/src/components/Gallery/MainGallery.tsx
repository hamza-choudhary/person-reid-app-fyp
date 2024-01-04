
import { Box, Button, Card, CardContent, Grid,Modal } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Heading from '../Heading'
import GalleryModal from './GalleryModal'

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

const MainGallery = () => {
  const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const [images, setImages] = useState([])

	useEffect(() => {
		// Fetch images when the component mounts
		axios
			.get('http://localhost:8080/api/images/gallery')
			.then((response) => {
				setImages(response.data.data)
			})
			.catch((error) => {
				console.log('There was an error fetching the images:', error)
			})
	}, [])
	return (
		<Box className="GaleryMain">
			<Heading
				text="Gallery"
				color="text.secondary"
				margin="0px 0px 30px"
				textAlign="center"
			/>
			<Box className="GalleryMainCard">
				<Card>
					<CardContent>
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
									<GalleryModal />
								</Box>
							</Modal>
						</Box>

						<Box sx={{ mt: '20px' }}>
							<Grid
								container
								className="displayGalleryImageMain"
								columnSpacing={{ md: 2, xs: 1 }}
								rowSpacing={{ md: 2, xs: 1 }}
							>
								{images &&
									images.map((image: string) => {
										return (
											<Grid key={image} item xs={6} md={4} lg={3}>
												<Box
													component="img"
													src={`http://localhost:8080/uploads/gallery/${image}`}
												/>
											</Grid>
										)
									})}
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
}

export default MainGallery
