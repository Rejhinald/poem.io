"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getUserInfo } from '../api/userInfoAPI';
import logoutAPI from '../api/logoutAPI';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type User = {
  email: string;
  [key: string]: any;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserInfo(storedToken).then(setUser);
    }
  }, []);

  useEffect(() => {
    const syncLogin = (event: StorageEvent) => {
      if (event.key === 'login') {
        console.log('logged in from storage!');
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          getUserInfo(storedToken).then(setUser);
        }
      }
    };

    window.addEventListener('storage', syncLogin);
    return () => {
      window.removeEventListener('storage', syncLogin);
    };
  }, []);

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, []);

  const handleLogout = () => {
    if (token) {
      logoutAPI(token).then(success => {
        if (success) {
          setUser(null);
          localStorage.removeItem('token');
          setToken(null);
          router.push('/');
          window.localStorage.setItem('logout', Date.now().toString()); // New line
        } else {
          console.log('Logout failed');
        }
      });
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" className="backdrop-filter backdrop-blur-lg bg-white bg-opacity-40 rounded-full mx-auto my-2 w-11/12 text-black top-0 left-0 right-0 m-auto">
      <Toolbar className="flex justify-between items-center">
        {isMobile ? (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        ) : null}
        <Typography variant="h6">
          Logo
        </Typography>
        <div className="flex items-center space-x-4">
          {!isMobile && user && (
            <>
              <Button color="inherit" onClick={() => router.push('/home')}>Home</Button>
              <Button color="inherit" onClick={() => router.push('/chat')}>Chat</Button>
              <Button color="inherit" onClick={() => router.push('/history')}>History</Button>
              <Button color="inherit" onClick={() => router.push('/tutorial')}>Tutorial</Button>
              <Button color="inherit" onClick={() => router.push('/faq')}>FAQ</Button>
            </>
          )}
          {user ? (
            <>
              <Typography variant="body1">{user.email}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>Login</Button>
          )}
        </div>
      </Toolbar>
      {isMobile && (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItem onClick={() => router.push('/home')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem onClick={() => router.push('/chat')}>
              <ListItemText primary="Chat" />
            </ListItem>
            <ListItem onClick={() => router.push('/history')}>
              <ListItemText primary="History" />
            </ListItem>
            <ListItem onClick={() => router.push('/tutorial')}>
              <ListItemText primary="Tutorial" />
            </ListItem>
            <ListItem onClick={() => router.push('/faq')}>
              <ListItemText primary="FAQ" />
            </ListItem>
            {/* Add more navigation items here */}
          </List>
        </Drawer>
      )}
    </AppBar>
  );
}