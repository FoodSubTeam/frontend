import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';
import NavBar from './components/NavBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <React.Fragment>
          <NavBar />
          <App />
        </React.Fragment>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
