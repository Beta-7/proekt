
import React from 'react';
import './Navbar.css';
import axios from 'axios';
import auth from "../Auth.js"
axios.defaults.baseURL = 'http://localhost:5000';

const Navbar = () => {
  const [logged, setLogged] = React.useState('');  
  const Authenticated = localStorage.getItem('Authenticated');

  const logoutBtn = (e) => {
    e.preventDefault();
    auth.logout();
    window.location.reload();
  };

  const loginBtn = (e) => {
    e.preventDefault();
    console.log('The link was clicked.');
  };

  const formatStatus = () => {
    console.log(Authenticated)
        if (Authenticated === 'True'){
          return <div className="" onClick={logoutBtn}>logout</div>
        }
        else {
          return <div className="" onClick={loginBtn}>login</div>
        }
    
  }     
        
        return (
<nav className="navbar navbar-default">
  <div className="container-fluid">
    <div className="navbar-header">
      <a className="navbar-brand" href="https://google.com/">WebSiteName</a>
    </div>
    <ul className="nav navbar-nav">
      <li className="active"><a href="https://google.com/">Home</a></li>
      <li><a href="https://google.com/">Page 1</a></li>
      <li><a href="https://google.com/">Page 2</a></li>
      <li><a href="https://google.com/">Page 3</a></li>
    </ul>
    <ul className="nav navbar-nav navbar-right">
      {formatStatus(logged)}
    </ul>
  </div>
</nav>
  );
}

export default Navbar;
