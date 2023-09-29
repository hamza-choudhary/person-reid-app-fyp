import { Box, Typography } from "@mui/material";
import LoginForm from "../../components/Home/LoginForm";

const Auth = () => {
  return (
    <Box
      className="loginMainBackground"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box className="loginPageMain">
        <Box className="loginPageLogoAndTitle">
          <Box
            component="img"
            src="assets/logo.png"
            sx={{
              marginBottom: "15px",
              width: { lg: "90px", xl: "120px" },
              height: { lg: "90px", xl: "120px" },
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontSize: { lg: "40px", xl: "60px" },
                fontWeight: "700",
              }}
            >
              ReIDify
            </Typography>
          </Box>
        </Box>
        <Box className="loginPageFormMain">
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
