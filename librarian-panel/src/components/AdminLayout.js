import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon

const drawerWidth = 240;

function AdminLayout({ children, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Define the navigation items for the librarian panel
  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'User Management', icon: <PeopleIcon />, path: '/users' },
    { label: 'Borrow Management', icon: <ListAltIcon />, path: '/borrows' },
    { label: 'Borrow Book', icon: <ListAltIcon />, path: '/borrow-book' },
  ];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          backgroundColor: 'var(--paper-bg)',
          color: 'var(--text-color)',
        }}
      >
        <Typography variant="h6" noWrap>
          Librarian Panel
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding onClick={() => navigate(item.path)}>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'var(--text-color)' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: 'var(--text-color)' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'var(--primary-color)', // Dynamic background color
          color: 'var(--text-color)', // Dynamic text color
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: 'none' },
              color: 'var(--text-color)',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Librarian Dashboard
          </Typography>
          {/* Theme toggle button */}
          <IconButton
    onClick={toggleTheme}
    sx={{
      marginLeft: 'auto',
      color: 'var(--text-color)',
      border : '1px solid var(--paper-bg)',
      borderRadius: '5px',
      padding: '5px',
    }}
  >
    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
  </IconButton>

        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'var(--paper-bg)', // Dynamic drawer background
              color: 'var(--text-color)', // Dynamic drawer text color
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'var(--paper-bg)', // Dynamic drawer background
              color: 'var(--text-color)', // Dynamic drawer text color
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'var(--bg-color)', // Dynamic content background
          color: 'var(--text-color)', // Dynamic text color
        }}
      >
        <Toolbar /> {/* Push content below the AppBar */}
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
