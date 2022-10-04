import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {TextField, InputLabel, Select, MenuItem, FormControl} from '@mui/material';

import {useAuthHeader, useAuthUser} from 'react-auth-kit';

import axios from 'axios'


const {Option} = Select;

export default function Credentials() {
  const authUser = useAuthUser();
  const authHeader = useAuthHeader();
  const [credentials, setCredentials] = useState([]);

  console.log(authUser() + '------------')

  const getCredentials = () => {
    axios.post('http://localhost:3000/credentials/get', {name: authUser().name}, {
      headers: {
        'Authorization': authHeader()
      }
    })
      .then((res) => {
        setCredentials(res.data)
        console.log(res.data)
      })
      .catch((err) => alert(err))
  }
  useEffect(() => {
    getCredentials();
  }, [])

  const [username, setUsername] = useState('');
  const [site, setSite] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('');

  const [divisions, setDivisions] = useState([]);
  const getDivisions = () => {
    axios.get('http://localhost:3000/division/get/all')
      .then((res) => setDivisions(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getDivisions();
  }, []);

  const addCredential = () => {
    axios.post('http://localhost:3000/credential/add', {
      name: username,
      site: site,
      password: password,
      division: division,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader(),
      }
    })
      .then((res) => {
        console.log(res);
        getCredentials();
        alert('Added credential');
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid red',
        width: '100%',
        // marginTop: 250,
      }}
    >
      <table style={{maxWidth: 1000}}>
        <thead>
        <tr>
          <th>Username</th>
          <th>Division</th>
          <th>Site</th>
          <th>Password</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><TextField label="Username" size="small" onChange={(e) => setUsername(e.target.value)}/></td>
          <td>
            <FormControl fullWidth>
              <InputLabel id="selectDivision">Division</InputLabel>
              <Select
                labelId="selectDivision"
                value={division}
                size="small"
                fullWidth
                onChange={(e) => {
                  setDivision(e.target.value)
                }}
              >
                {divisions.map((item) => {
                  return (
                    <MenuItem value={item._id}>{item.name} ({item.parent})</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </td>
          <td><TextField label="Site" size="small" onChange={(e) => setSite(e.target.value)}/></td>
          <td><TextField label="Password" type="password" size="small" onChange={(e) => setPassword(e.target.value)}/>
          </td>
          <td><Button onClick={() => addCredential()}>Add</Button></td>
        </tr>
        {credentials.map((item) => {
          const found = divisions.find(obj => obj._id === item.division);
          console.log('found: ' + found)
          return (
            <tr>
              <td>{item.name}</td>
              <td>{found.name} ({found.parent})</td>
              <td>{item.site}</td>
              <td>{item.password}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}