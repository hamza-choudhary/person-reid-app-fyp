import CollectionsIcon from '@mui/icons-material/Collections'
import ConstructionIcon from '@mui/icons-material/Construction'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import Person2Icon from '@mui/icons-material/Person2'
import QuizIcon from '@mui/icons-material/Quiz'
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './UI/Button'

const drawerWidth = 240

export default function ResponsiveDrawer(props: any) {
  let pages: { name: string; link: string; icon: any }[] = [
    {
      name: 'Home',
      link: '/',
      icon: <HomeIcon />,
    },
    { name: 'Inference', link: `/inference`, icon: <ConstructionIcon /> },
    { name: 'Query', link: `/queries`, icon: <QuizIcon /> },
    { name: 'Gallery', link: `/galleries`, icon: <CollectionsIcon /> },
    {
      name: 'Gallery videos',
      link: `/galleries/videos`,
      icon: <VideoCameraBackIcon />,
    },
    { name: 'Results', link: `/results`, icon: <FilterCenterFocusIcon /> },
    { name: 'Manage employees', link: `/employees`, icon: <PeopleAltIcon /> },
    { name: 'Profile', link: `/profile`, icon: <Person2Icon /> },
    { name: 'About Us', link: `/about-us`, icon: <Diversity3Icon /> },
    // { name: "FAQs", link: `/faqs` },
  ]

  const { logout, state } = useAuth()
  if (state.user?.role !== 'admin') {
    pages = pages.filter((item) => item.name !== 'Manage employees')
  }

  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {pages.map((text) => (
          <ListItem key={text.name} disablePadding>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <NavLink
                to={`${text.link}`}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '15px',
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 'auto' }}>
                  {text.icon}
                </ListItemIcon>
                <ListItemText primary={text.name} />
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </div>
  )

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <div className="flex justify-end items-end absolute right-6 top-4">
          <Button
            className="px-[1rem] py-1 bg-red-400 hover:bg-red-600 cursor-pointer z-50"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1C1D25',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1C1D25',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '50px',
        }}
      >
        {props.children}
        {/* <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography> */}
      </Box>
    </Box>
  )
}
