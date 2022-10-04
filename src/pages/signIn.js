// Template from MUI

import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Auth
import { useSignIn, useIsAuthenticated } from 'react-auth-kit';

export default function SignIn() {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    } else {
      console.log('Not signed in!');
    }
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password: password }),
    };
    axios
      .post('http://localhost:3000/user/login', {
        name: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        if (
          signIn({
            token: res.data.token,
            expiresIn: 60,
            tokenType: 'Bearer',
            authState: {role: res.data.role, name: res.data.name},
          })
        ) {
          console.log('Success!');
          navigate('/');
        } else {
          alert('Error!');
        }
      })
      .catch((error) => {
        alert(error);
      });
    // fetch('http://localhost:3000/user/login', options)
    //   .then((res) => {
    //     console.log(res.json());
    //     // console.log(res);
    //   })
    //   .then((json) => {
    //     console.log(json);
    //     if (
    //       signIn({
    //         token: json.token,
    //         expiresIn: 60,
    //         tokenType: 'Bearer',
    //         authState: json.role,
    //       })
    //     ) {
    //       console.log('Success!');
    //       navigate('/');
    //     } else {
    //       alert('Error!');
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid red',
        width: '100%',
      }}
    >
      <Container component='main' maxWidth='xs'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography component='h1' variant='h4'>
            Cool Tech Auth Page
          </Typography>
          <br />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            // component='form'
            // noValidate
            sx={{ mt: 1 }}
            // onSubmit={handleSubmit}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleSubmit()}
            >
              Sign In
            </Button>

            <Link href='#' variant='body2'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
