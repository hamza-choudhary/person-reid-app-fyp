import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ResponsiveDrawer from "./Sidebar";

const Layout = (props: any) => {
  return (
    <Box className="layoutMain">
      <Box className="navbarMain">
        {/* <Navbar /> */}
        <ResponsiveDrawer />
      </Box>
      <Box className="layoutContentMain" sx={{ m: "0 auto" }}>
        {props.children}
      </Box>
      <Box className="layoutFooter" sx={{ m: "0 auto" }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
