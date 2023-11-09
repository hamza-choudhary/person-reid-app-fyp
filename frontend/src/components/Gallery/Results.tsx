import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Heading from '../Heading'

// type ApiResponse = {
// 	imageUrls: string[]
// }

export default function ImageFetcher() {
	const [imageUrls, setImageUrls] = useState<string[]>([])

	const fetchImageUrls = async () => {
		try {
			const response = await fetch('http://localhost:8080/api/images/results')
			const result = await response.json()
			const data = result.data
			console.log(data.length)
			console.log(imageUrls.length)
			if (data.length !== imageUrls.length) {
				setImageUrls(data)
				console.log(imageUrls)
			}
		} catch (error) {
			console.error('Failed to fetch image URLs:', error)
		}
	}

	useEffect(() => {
		const id = setInterval(fetchImageUrls, 2000)
		return () => clearInterval(id)
	}, []) // Removed dependencies to prevent re-creating interval

	return (
		<Box>
			<Heading
				text="Results"
				textAlign="center"
				margin="20px 0px 0px"
				color="text.secondary"
			/>
			<Typography
				paragraph
				sx={{
					mb: '30px',
					mt: '0px',
					fontSize: { xs: '12px', md: '14px' },
					textAlign: 'center',
				}}
				color="text.secondary"
			>
				<strong>Note:</strong> Results are automatically updated every 5
				seconds.
			</Typography>
			<Card>
				<CardContent>
					<Grid
						container
						rowSpacing={{ md: 2, xs: 1 }}
						columnSpacing={{ md: 2, xs: 1 }}
					>
						{imageUrls &&
							imageUrls.map((img) => {
                console.log(img)
								return (
									<Grid key={img} item xs={6} md={4} lg={3}>
										<Box
											component="img"
											src={`http://localhost:8080/uploads/results/${img}`}
											sx={{ width: '100%', height: 'auto' }} // Added to ensure images are responsive
										/>
									</Grid>
								)
							})}
					</Grid>
				</CardContent>
			</Card>
		</Box>
	)
}
