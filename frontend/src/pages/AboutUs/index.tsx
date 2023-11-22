import ResponsiveDrawer from "../../components/Sidebar";
import { Typography, Box, Grid } from "@mui/material";
const AboutUs = () => {
  return (
    <ResponsiveDrawer>
      <Typography variant="h2" textAlign="center" color="text.secondary">
        Meet the Team
      </Typography>

      <Grid container columnSpacing={2} sx={{ mt: "30px" }}>
        <Grid item lg={6}>
          <Box>
            <Typography
              variant="h3"
              color="text.secondary"
              sx={{
                fontWeight: "600",
                textAlign: "center",
                mb: "10px",
                fontSize: "26px",
              }}
            >
              Our Mission
            </Typography>
            <Typography paragraph color="text.secondary">
              At ReIDify Me, our mission is to revolutionize person
              re-identification technology. We aim to provide a seamless and
              efficient solution for identifying individuals across multiple
              images, with a focus on accuracy, speed, and user-friendly
              experience.
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={6}>
          <Box>
            <Typography
              variant="h3"
              color="text.secondary"
              sx={{
                fontWeight: "600",
                textAlign: "center",
                mb: "10px",
                fontSize: "26px",
              }}
            >
              The Journey So Far
            </Typography>
            <Typography paragraph color="text.secondary">
              Our journey began as a Final Year Project for our Bachelor's
              degree in Computer Science. Motivated by a shared passion for
              cutting-edge technology and a desire to make a meaningful impact,
              we embarked on the challenging yet rewarding path of developing a
              person re-identification system.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ResponsiveDrawer>
  );
};

export default AboutUs;
