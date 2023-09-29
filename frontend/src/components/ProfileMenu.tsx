import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  return (
    <Box
      component="div"
      className="profileMenuMain"
      sx={{ backgroundColor: "#1C1D25", position: "absolute", right: "0" }}
    >
      <Box component="div" className="profileMenuBtns">
        <Box
          className="profileMenuBtnSingle"
          sx={{
            marginBottom: "10px",
            padding: "10px 60px",
          }}
        >
          <Link
            to="/profiles"
            style={{
              textDecoration: "none",
              color: "white",
              display: "inline-block",
            }}
          >
            My Account
          </Link>
        </Box>
        <Box
          className="profileMenuBtnSingle"
          sx={{
            marginBottom: "10px",
            padding: "10px 60px",
          }}
        >
          <Link
            to="/sign-in"
            style={{
              textDecoration: "none",
              color: "white",
              display: "inline-block",
            }}
          >
            Sign Out
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileMenu;
