import {useState, useEffect} from 'react';

// MUI
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

import axios from 'axios';
import {useAuthHeader, useAuthUser} from 'react-auth-kit';
import {useNavigate, Navigate} from 'react-router-dom';


const OUS = [
  {name: 'News managment', value: 'news_managment'},
  {name: 'Software reviews', value: 'software_reviews'},
  {name: 'Hardware reviews', value: 'hardware_reviews'},
  {name: 'Opinion publishing', value: 'opinion_publishing'},
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateUser() {
  const authUser = useAuthUser();
  useNavigate();
  const authHeader = useAuthHeader();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post(
        'http://localhost:3000/user/add',
        {
          name: data.get('name'),
          password: data.get('password'),
          role: data.get('role'),
          ou: data.get('ou').split(','),
          division: data.get('division').split(','),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        console.log(res);
        alert('User created!');
      })
      .catch((err) => console.log(err));
    console.log({
      name: data.get('name'),
      password: data.get('password'),
      role: data.get('role'),
      ou: data.get('ou').split(','),
      division: data.get('division').split(','),
    });
  };

  const [ous, setOus] = React.useState([]);

  const handleOuChange = (event) => {
    const {
      target: {value},
    } = event;
    setOus(
      // On autofill we get a string field value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [divisions, setDivisions] = useState([]);
  useEffect(() => {
    console.log(ous.data);
    axios
      .post('http://localhost:3000/division/get', {
        parent: ous,
      })
      .then((res) => {
        console.log(res.data);
        setDivisions(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ous]);

  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const handleDivisionSelect = (event) => {
    const {
      target: {value},
    } = event;
    setSelectedDivisions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  }

  // Getting divisions
  const [divisionsData, setDivisionsData] = useState([]);
  const getDivisions = () => {
    axios.get('http://localhost:3000/division/get/all')
      .then((res) => setDivisionsData(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getDivisions();
  }, []);

  if (authUser() != 'admin') {
    alert('Insufficient permissions!');
    return <Navigate to="/" replace={true}/>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Create User
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField id="role" name="role" label="Role" fullWidth select>
                <MenuItem value={'normal'}>Normal</MenuItem>
                <MenuItem value={'managment'}>Managment</MenuItem>
                <MenuItem value={'admin'}>Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Select
                id="ou"
                name="ou"
                label="OU's"
                fullWidth
                multiple
                value={ous}
                onChange={handleOuChange}
                renderValue={(selected) => selected.join(', ')}
                input={<OutlinedInput label="Tag"/>}
                MenuProps={MenuProps}
              >
                {OUS.map((ou) => (
                  <MenuItem key={ou} value={ou.value}>
                    <Checkbox checked={ous.indexOf(ou.value) > -1}/>
                    <ListItemText primary={ou.name}/>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                id="division"
                name="division"
                label="Divisions"
                fullWidth
                multiple
                value={selectedDivisions}
                onChange={handleDivisionSelect}
                renderValue={(selected) => {
                  let tempArr = []
                  selected.map((item) => {
                    const obj = divisions.find(obj => obj._id === item);
                    tempArr.push(obj.name)
                  })
                  return (
                    tempArr.join(', ')
                  )
                }}
                input={<OutlinedInput label="Tag"/>}
                MenuProps={MenuProps}
              >
                {divisions.map((division) => (
                  <MenuItem
                    key={division}
                    value={division._id}
                  >
                    <Checkbox checked={selectedDivisions.indexOf(division._id) > -1}/>
                    <ListItemText primary={`${division.name} (${division.parent})`}/>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
