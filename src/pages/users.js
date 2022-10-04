import './usersTable.css';

import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {TextField, MenuItem, Select} from '@mui/material';

//MUI
// import DeleteIcon from '@material-ui/icons/Delete';

import {Card, Modal} from 'antd';

import axios from 'axios'

import {Navigate} from 'react-router-dom';

import {useAuthUser} from 'react-auth-kit';


const {Option} = Select;

export default function Users() {
  const authUser = useAuthUser();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const options = {
      url: 'http://localhost:3000/users/get',
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    }
    axios(options)
      .then((response) => {
        // console.log(response.data)
        setUsers(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  };

  // Getting divisions
  const [divisions, setDivisions] = useState([]);
  const getDivisions = () => {
    axios.get('http://localhost:3000/division/get/all')
      .then((res) => setDivisions(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getUsers();
    getDivisions();
  }, []);
  useEffect(() => {
    console.log(divisions);
    console.log(divisions.find(obj => obj._id === '631b25348fff89a4df0d44ad'))
  }, [divisions])


  const [deleteID, setDeleteID] = useState('');
  const deleteUser = (id) => {
    axios.post('http://localhost:3000/user/delete', {
      id: id
    })
      .then(() => console.log('Deleted user'))
      .catch((err) => console.log(err));
    getUsers();
  }
  const handleDeleteClick = (id) => {
    console.log(id);
    deleteUser(id);
    getUsers();
  }

  if (authUser().role === 'normal') {
    alert('Insufficient permissions!');
    return <Navigate to="/" replace={true}/>;
  }

  if (divisions === []) {
    return <></>
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
      <Card style={{width: 900}}>
        {/* <Table columns={columns} dataSource={users} bordered /> */}
        <table>
          <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>OU's</th>
            <th>Divisions</th>
            <th className="deleteField"></th>
            <th className="editField"></th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => {
            console.log(user.division);
            return (
              <tr key={user._id}>
                <td>
                  {user.username}
                </td>
                <td>
                  {user.role}
                </td>
                <td>
                  {user.ou}
                </td>
                <td>
                  <ul>
                    {user.division.map((division) => {
                      const item = divisions.find(obj => obj._id === division);
                      return (
                        <li className='divisionItem'>{`${item.name} (${item.parent})`}</li>
                      )
                    })}
                  </ul>
                </td>
                <td>
                  <Button onClick={() => handleDeleteClick(user._id)}>DeleteIcon</Button>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </Card>
      {/* Edit modal */}
      <Modal>
        <div></div>
      </Modal>
    </div>
  );
}
