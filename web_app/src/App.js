import React from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Login from './component/Login.js'; // Calling login component

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Login />
      </header>
    </div>
  );
}

export default App;
