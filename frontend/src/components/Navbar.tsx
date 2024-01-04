import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
// import Logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

function Navbar() {
  const role = window.localStorage.getItem("role");
  const username = window.localStorage.getItem("username");

  const pages: { name: string; link: string }[] = [
    {
      name: "Home",
      link: "/",
    },
    { name: "Gallery", link: `/gallery` },
    // { name: "About Us", link: `/about-us` },
    // { name: "FAQs", link: `/faqs` },
  ];
  //   const settings: { name: string; link: string }[] = [
  //     { name: "Profile", link: "/profile" },
  //     {
  //       name: "Logout",
  //       link: role === "user" ? "/sign-in/user" : "/sign-in/provider",
  //     },
  //   ];
  // console.log(useSelector((state: any) => state));
  // const {userInfo} = useSelector((state:any)=> )
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "palette.primary.main" }}>
      <Container maxWidth="xl" className="navbarContainer">
        <Toolbar disableGutters>
          {/* <Box
            component="img"
            src={Logo}
            sx={{
              width: "40px",
              mr: "20px",
              display: { md: "inherit", xs: "none" },
            }}
          /> */}
          <Typography
            sx={{
              color: "primary",
              fontSize: "16px",
              fontWeight: "900",
              display: { xs: "none", md: "block" },
            }}
          >
            ReIdfy
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              color: "black",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <NavLink
                    to={page.link}
                    color="primary"
                    style={{
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* <Box
              component="img"
              src={Logo}
              sx={{
                width: "40px",
                display: { md: "none", xs: "flex" },
              }}
            /> */}
            <Typography
              sx={{ color: "#1b9ad1", fontSize: "16px", fontWeight: "900" }}
            >
              PRUUF.pro
            </Typography>
          </Typography>
          {/* <Box
            component="img"
            src={Logo}
            sx={{
              width: "80px",
              display: { md: "none", xs: "flex" },
            }}
          /> */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: { xs: "inherit", md: "end" },
              mr: { xs: "inherit", lg: "20px" },
            }}
          >
            {pages.map((page, index) => (
              <NavLink
                key={index}
                to={page.link}
                onClick={handleCloseNavMenu}
                style={{
                  margin: "0px 10px",
                  textDecoration: "none",
                  color: "white",
                  display: "block",
                }}
              >
                {page.name}
              </NavLink>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
                <Typography>
                  <span style={{ marginLeft: "10px" }}>{username}</span>
                </Typography>
              </IconButton>
            </Tooltip>
            {/* <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting: any, index: number) => (
                <MenuItem key={index} onClick={handleCloseUserMenu}>
                  <NavLink
                    to={setting.link}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "10px 20px",
                    }}
                  >
                    <Button
                      type="submit"
                      onClick={
                        setting.name === "Logout"
                          ? () => {
                              window.localStorage.removeItem("userToken");
                              window.localStorage.removeItem("username");
                              window.localStorage.removeItem("userId");
                              window.localStorage.removeItem("role");
                              window.localStorage.removeItem("userInfo");
                            }
                          : () => null
                      }
                      sx={{ color: "white" }}
                    >
                      <Typography>{setting.name}</Typography>
                    </Button>
                  </NavLink>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
