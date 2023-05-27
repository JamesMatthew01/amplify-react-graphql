import { Authenticator } from '@aws-amplify/ui-react';

import { PublicBoard } from './components/PublicBoard';
import { RequireAuth } from './RequireAuth';
import { Login } from './components/Login';
import { PrivateBoard } from './components/PrivateBoard';
import { Home } from './components/Home';
import { Layout } from './components/Layout';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthenticator, View } from '@aws-amplify/ui-react';
import './App.css';


function MyRoutes() {
  const { user } = useAuthenticator((context) => [context.user]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/PublicBoard"
            element={<PublicBoard />}
          />
          <Route
            path="/PrivateBoard"
            element={
              <RequireAuth>
                <PrivateBoard />
              </RequireAuth>
            }
          />
          <Route path="/Login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {

  return (
    <Authenticator.Provider>
      <MyRoutes />
    </Authenticator.Provider>
  );
}

export default App;