import { Box, Typography } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "primary.main", p: "20px 20px" }}>
      <Typography
        sx={{
          fontSize: "12px",
          mb: "0",
          display: "flex",
          alignItems: "center",
        }}
        color="text.primary"
        paragraph
      >
        <CopyrightIcon sx={{ fontSize: "16px" }} />
        This project is a property of Comsats University, Lahore
      </Typography>
    </Box>
  );
};

export default Footer;
