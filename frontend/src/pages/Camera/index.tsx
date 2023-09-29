import AddCamera from "../../components/Camera/AddCamera";
import CameraMain from "../../components/Camera/CameraMain";
import Layout from "../../components/Layout";
import { Grid } from "@mui/material";

const Camera = () => {
  return (
    <Layout>
      <Grid container spacing={2} sx={{ padding: "30px 0px", maxWidth: "99%" }}>
        <Grid item xs={8}>
          <CameraMain />
        </Grid>
        <Grid item xs={4}>
          <AddCamera />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Camera;
