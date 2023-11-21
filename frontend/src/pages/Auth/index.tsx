import { Box, Typography } from "@mui/material";
import LoginForm from "../../components/Auth/LoginForm";
import Logo from "../../assets/logo.png";
import AuthBanner from "../../assets/auth-banner.png";

const Auth = () => {
  return (
    <Box
      className="loginMainBackground"
      sx={{
        display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "primary.main",
      }}
    >
      <Box sx={{ width: "55%" }}>
        <Box
          component="img"
          src={AuthBanner}
          sx={{ height: "100vh", display: "block" }}
        />
      </Box>
      <Box
        className="loginPageMain"
        sx={{
          //   backgroundColor: "primary.main",
          //   p: "20px",
          //   width: "50%",
          width: "45%",
          p: "0px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          //   borderRadius: "8px",
        }}
      >
        <Box className="loginPageLogoAndTitle" sx={{ textAlign: "center" }}>
          <Box
            component="img"
            src={Logo}
            sx={{
              marginBottom: "15px",
              width: { lg: "90px", xl: "120px" },
              height: { lg: "90px", xl: "120px" },
            }}
          />
        </Box>
        <Box className="loginPageFormMain" sx={{ width: "100%" }}>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
