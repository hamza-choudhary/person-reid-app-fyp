import React from "react";
import { Box, Stack, Button, Grid, Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState: { username: string; password: string; role: string } = {
  username: "",
  password: "",
  role: "",
};

const LoginForm = () => {
  const [form, setForm] = React.useState(initialState);
  const navigate = useNavigate();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e: any) => {
    if (form.username && form.password && form.role) {
      console.log(form);
      navigate("/");
    } else {
      e.preventDefault();
      return toast.error("All Fields are Mandatory");
    }
  };

  return (
    <Box className="loginFormMain">
      <form action="" onSubmit={submitHandler}>
        <Stack spacing={{ lg: 2, xl: 4 }}>
          <input
            placeholder="UserName"
            value={form.username}
            name="username"
            type="text"
            onChange={changeHandler}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.5)",
              outline: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
            }}
          />
          <input
            placeholder="Password"
            value={form.password}
            name="password"
            type="password"
            onChange={changeHandler}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.5)",
              outline: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
            }}
          />
          <Grid container sx={{ gap: "20px" }}>
            <Grid item sx={{ padding: "5px" }}>
              <Typography paragraph sx={{ color: "rgba(255,255,255,0.5)" }}>
                Login as:
              </Typography>
            </Grid>
            <Grid item>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="role"
                value={form.role}
                onChange={handleRoleChange}
                sx={{ color: "rgba(255,255,255,0.5)" }}
                className="loginFormRadio"
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value="security-guard"
                  control={<Radio />}
                  label="Security Guard"
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                background: "#000",
                padding: { lg: "15px 40px", xl: "20px 50px" },
                borderRadius: "10px",
              }}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
