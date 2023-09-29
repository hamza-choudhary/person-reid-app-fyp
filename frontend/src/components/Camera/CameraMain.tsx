import { Grid, Box, Typography } from "@mui/material";
import CameraModule from "./CameraModule";

const CameraMain = () => {
  return (
    <Box sx={{ background: "black", padding: "20px 0px" }}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          rowGap: "30px",
          height: "80vh",
          overflowX: "hidden",
          padding: "0px 20px",
        }}
      >
        <Grid item xs={5.9}>
          <Typography paragraph sx={{ color: "white", marginBottom: "5px" }}>
            Camera 1
          </Typography>
          <CameraModule />
        </Grid>
        <Grid item xs={5.9}>
          <Typography paragraph sx={{ color: "white", marginBottom: "5px" }}>
            Camera 2
          </Typography>
          <CameraModule />
        </Grid>
        <Grid item xs={5.9}>
          <Typography paragraph sx={{ color: "white", marginBottom: "5px" }}>
            Camera 3
          </Typography>
          <CameraModule />
        </Grid>
        <Grid item xs={5.9}>
          <Typography paragraph sx={{ color: "white", marginBottom: "5px" }}>
            Camera 4
          </Typography>
          <CameraModule />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CameraMain;
