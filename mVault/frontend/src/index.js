import React from 'react';
import ReactDOM from 'react-dom/client'; // This fixes the 'ReactDOM is not defined' error
import App from './App';

// We create the root element here
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* IMPORTANT: No <BrowserRouter> here.
        It is already in your App.js.
    */}
    <App />
  </React.StrictMode>
);