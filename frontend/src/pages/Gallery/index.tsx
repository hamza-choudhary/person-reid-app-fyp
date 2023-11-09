import React from "react";
import { Box, Button, Grid } from "@mui/material";
import MainGallery from "../../components/Gallery/MainGallery";
import Layout from "../../components/Layout";
import Query from "../../components/Gallery/Query";
import Results from "../../components/Gallery/Results";
import ResponsiveDrawer from "../../components/Sidebar";

const Gallery = () => {
  const [activeComponent, setActiveCompnent] = React.useState("gallery");
  return (
    <ResponsiveDrawer>
      <Box sx={{ maxWidth: "100%", m: "0 auto" }}>
        {/* <Box className="galleryTopBtn">
          <Grid
            container
            columnSpacing={2}
            sx={{ justifyContent: "center", mt: "20px" }}
          >
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setActiveCompnent("gallery")}
              >
                Gallery
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setActiveCompnent("queryAndResults")}
              >
                Query And Results
              </Button>
            </Grid>
          </Grid>
        </Box> */}
        <Box sx={{ m: "0px 0px" }}>
          <MainGallery />
        </Box>
        {/* <Box sx={{ m: "20px 0px" }}>
          {activeComponent === "queryAndResults" && (
            <>
              <Query />
              <Results />
            </>
          )}
        </Box> */}
      </Box>
    </ResponsiveDrawer>
  );
};

export default Gallery;
