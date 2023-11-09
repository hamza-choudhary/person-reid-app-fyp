import { Box, Typography } from "@mui/material";

const Heading = (props: any) => {
  return (
    <Box sx={{ m: `${props.margin}` }}>
      <Typography variant="h2" color={props.color} textAlign={props.textAlign}>
        {props.text}
      </Typography>
    </Box>
  );
};

export default Heading;
