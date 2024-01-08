import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeMain = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        textAlign="center"
        sx={{ mb: "20px" }}
        color="text.secondary"
      >
        Welcome to ReIDfy Me!
      </Typography>
      <Button
        sx={{ p: "10px 130px !important" }}
        onClick={() => navigate("/galleries")}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default HomeMain;
