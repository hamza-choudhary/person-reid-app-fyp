import { Box } from "@mui/material";
import logo from "/assets/logo.png";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { NavLink, useLocation } from "react-router-dom";
import { Toolbar } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VideocamIcon from "@mui/icons-material/Videocam";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function SideDrawer(props: Props) {
  const location = useLocation();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [profileDropdown, setProfileDropdwon] = useState(false);

  const handleProfileDropdown = () => {
    setProfileDropdwon(!profileDropdown);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menu: { title: string; icon: any; url: string }[] = [
    {
      title: "Home",
      icon: <HomeIcon />,
      url: "/",
    },
    {
      title: "Camera",
      icon: <VideocamIcon />,
      url: "/camera",
    },
    {
      title: "History",
      icon: <HistoryIcon />,
      url: "/history",
    },
    {
      title: "Profile",
      icon: <PersonIcon />,
      url: "/profile",
    },
    {
      title: "FAQs",
      icon: <LiveHelpIcon />,
      url: "/faqs",
    },
    {
      title: "Logout",
      icon: <LogoutIcon />,
      url: "/sign-in",
    },
  ];

  const drawer = (
    <div style={{ backgroundColor: "#1C1D25", height: "100vh" }}>
      <Box sx={{}}>
        <img
          src={logo}
          style={{
            marginTop: "20px",
            width: "70px",
            height: "70px",
            alignSelf: "center",
          }}
        />
      </Box>
      <List sx={{ marginTop: "20px" }}>
        {menu.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              marginBottom: { lg: "20px", xl: "30px" },
              justifyContent: "center",
            }}
          >
            <NavLink
              to={`${item.url}`}
              style={{ textDecoration: "none", color: "white" }}
              className={({ isActive }) =>
                isActive ? ".navlinkSideMenuActive" : ""
              }
            >
              <Box className="navigationMain">
                <Box className="navigationIcon" sx={{ textAlign: "center" }}>
                  {item.icon}
                </Box>
                <Box className="navigationText" sx={{ textAlign: "center" }}>
                  {item.title}
                </Box>
              </Box>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </div>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: "0px" }}>
      <AppBar
        position="fixed"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#1C1D25",
          boxShadow: "5px 0px 10px 0px rgba(30, 30, 30, 0.25)",
          height: "85px",
          justifyContent: "center",
        }}
      >
        <Box component="div" sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingX: "15px",
              paddingY: "10px",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <div className="vertical-line"></div>
            <img
              src="/assets/profilePic.jpg"
              style={{
                width: "35px",
                height: "35px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                marginLeft: "12px",
                letterSpacing: "0px",
              }}
            >
              Zakria Akram
            </Typography>

            <ArrowDropDownIcon
              style={{ fontSize: "26px", cursor: "pointer" }}
              onClick={handleProfileDropdown}
            />
          </Toolbar>
          {profileDropdown && <ProfileMenu />}
        </Box>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          height: "0px",
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1C1D25",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: "none",
              sm: "block",
              width: drawerWidth,
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              padding: "0px 20px",
              backgroundColor: "#1C1D25",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
