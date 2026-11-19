import React from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login.jsx';

createRoot(document.getElementById('login-root')).render(
  <React.StrictMode><Login /></React.StrictMode>
);
