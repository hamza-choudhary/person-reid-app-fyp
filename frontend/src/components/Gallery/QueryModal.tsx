import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const QueryModal = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [queryName, setQueryName] = useState("");

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Append files to formData
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("query", selectedFiles[i]);
    }

    // Append queryName to formData
    formData.append("name", queryName);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/upload-query",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful", response.data);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  return (
    <Box className="queryModalMain">
      <Typography
        variant="h3"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: "20px" }}
      >
        Upload the Query Image
      </Typography>
      <Box className="queryModalForm" component="form" onSubmit={onFormSubmit}>
        <Box sx={{ m: "15px 0px" }}>
          <TextField
            variant="filled"
            label="Enter Name of Person"
            type="text"
            fullWidth
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            sx={{ color: "black" }}
          />
        </Box>
        <Box>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
            {/* <input type="file" hidden onChange={handleFileChange} /> */}
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mt: "20px" }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QueryModal;
