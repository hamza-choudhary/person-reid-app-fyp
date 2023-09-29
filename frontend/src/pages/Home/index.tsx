import { Box, Typography, Grid, Button } from "@mui/material";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const getStartedClickHandler = () => {
    navigate("/upload-image");
  };
  return (
    <Layout>
      <Grid
        container
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "86vh",
        }}
      >
        <Grid item>
          <Box className="homepageMain">
            <Box className="homepageSingle">
              <Box
                component="img"
                src="/assets/logo.png"
                sx={{ width: "150px", height: "150px" }}
              ></Box>
            </Box>
            <Box className="homepageSingle">
              <Typography
                variant="h1"
                sx={{
                  color: "white",
                  fontSize: { lg: "50px", xl: "70px" },
                  fontWeight: "700",
                }}
              >
                Welcome to ReIDify
              </Typography>
            </Box>
            <Box className="homepageSingle">
              <Typography paragraph sx={{ color: "rgba(255,255,255,0.7)" }}>
                Zakria Akram
              </Typography>
            </Box>
            <Box className="homepageSingle">
              <Button
                variant="contained"
                sx={{
                  background: "#1C1D25",
                  borderRadius: "10px",
                  padding: { lg: "10px 40px", xl: "15px 50px" },
                }}
                onClick={getStartedClickHandler}
              >
                Upload an Image
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
