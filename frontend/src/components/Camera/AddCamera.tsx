import { Box, Button, Typography, Divider, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

const AddCamera = () => {
  return (
    <Box
      sx={{
        height: "86vh",
        background: "#1C1D25",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px 20px",
      }}
    >
      <Box sx={{ padding: "20px 0px" }}>
        <Button
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 50px",
            background: "black",
          }}
        >
          <span>
            <AddIcon />
          </span>
          <span>
            <Typography paragraph sx={{ color: "white", marginBottom: "0" }}>
              Add Camera
            </Typography>
          </span>
        </Button>
      </Box>
      <Divider sx={{ width: "100%", background: "rgba(255,255,255,0.3)" }} />
      <Box sx={{ padding: "20px 0px", width: "100%" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "600", fontSize: "20px", color: "white" }}
        >
          Camera List
        </Typography>
        <Grid
          container
          sx={{
            color: "white",
            justifyContent: "space-between",
            margin: "10px 0px",
          }}
        >
          <Grid item>Camera 1</Grid>
          <Grid item>
            <span style={{ marginRight: "10px" }}>
              <EditIcon />
            </span>
            <span>
              <ClearIcon />
            </span>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddCamera;
