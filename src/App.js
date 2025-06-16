// src/App.js
import React, { useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  const email = user?.signInDetails?.loginId || user?.username;

  useEffect(() => {
    console.log('Current User:', user);
  }, [user]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {email}!</h2>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default withAuthenticator(App);
