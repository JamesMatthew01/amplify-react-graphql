import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Button, Heading } from '@aws-amplify/ui-react';

export function Layout() {
  const { route, user, signOut } = useAuthenticator((context) => [
    context.route,
    context.signOut,
    context.user,
  ]);
  const navigate = useNavigate();

  function logOut() {
    signOut();
    navigate('/Login');
  }

  const message = "Auth Routes App" + ((route === "authenticated") ? (" - user: " + user.username) : " - Please Login");
  
  return (
    <>
      <nav>
        <Button onClick={() => navigate('/')}>Home</Button>
        <Button onClick={() => navigate('/PublicBoard')}>
          Public Message Board
        </Button>
        <Button onClick={() => navigate('/PrivateBoard')}>
          Private Message Board
        </Button>
        {route !== 'authenticated' ? (
          <Button onClick={() => navigate('/Login')}>Login</Button>
        ) : (
          <Button onClick={() => logOut()}>Logout</Button>
        )}
      </nav>
      <Heading level={1}>{message}</Heading>

      <Outlet />
    </>
  );
}