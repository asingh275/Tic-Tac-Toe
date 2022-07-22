import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '414862974439-g7jtcr53ilv3bfpth4evf6p3n7m1neg2.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

