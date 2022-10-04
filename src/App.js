import './App.css';

// Auth
import { AuthProvider, RequireAuth } from 'react-auth-kit';

// Pages
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Landing from './pages/landing';
import Users from './pages/users';
import Credentials from './pages/credentials';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

// Components
import Navbar from './components/navbar';

// Modules
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import CreateUser from './pages/create-user';

function App() {
  return (
    <AuthProvider authType='localstorage' authName='_auth'>
      <BrowserRouter>
        <Navbar />
        <div style={{ height: 'calc(100vh - 68px)', display: 'flex' }}>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/signIn' element={<SignIn />} />
            <Route
              path='/users'
              element={
                <RequireAuth loginPath='/signin'>
                  <Users />
                </RequireAuth>
              }
            />
            <Route
              path='/create-user'
              element={
                <RequireAuth loginPath='/signin'>
                  <CreateUser />
                </RequireAuth>
              }
            />
            <Route
              path='/credentials'
              element={
                <RequireAuth loginPath='/signin'>
                  <Credentials />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
