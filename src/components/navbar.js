import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useIsAuthenticated, useSignOut, useAuthUser } from 'react-auth-kit';

const pages = ['Products', 'Credentials', 'Users', 'Create-User'];

export default function Navbar() {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const signOut = useSignOut();

  const location = useLocation();
  const navigate = useNavigate();

  const [loginStyle, setLoginStyle] = useState({});

  useEffect(() => {
    if (location.pathname === '/signin') {
      setLoginStyle({
        display: 'none',
      });
    } else {
      setLoginStyle({});
    }
  }, [location.pathname]);

  // Love you endlessly <3 enjoy your chat with rachel

  useEffect(() => {
    console.log(isAuthenticated());
    console.log(authUser());
  }, [authUser, isAuthenticated]);

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to='/' style={{ color: 'white' }}>
              <Typography variant='h6'>Cool Tech</Typography>
            </Link>

            {pages.map((page) => (
              <Link
                key={page}
                style={{
                  margin: '0px 20px',
                  color: 'white',
                  display: 'block',
                }}
                to={`/${page.toLowerCase()}`}
              >
                {page}
              </Link>
            ))}
          </Box>
          {isAuthenticated() ? (
            <Button
              color='inherit'
              onClick={() => {
                signOut();
                alert('Logged out!');
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color='inherit'
              onClick={() => {
                // setUser({ name: 'Dylan' });
                navigate('/signin');
              }}
              style={loginStyle}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
