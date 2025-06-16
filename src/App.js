// src/App.js
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import EditProfile from './components/EditProfile';

function App({ signOut, user }) {
  return (
    <div>
      <h2>Welcome, {user.attributes.email}!</h2>
      <button onClick={signOut}>Sign Out</button>
      <EditProfile />
    </div>
  );
}

export default withAuthenticator(App);
