
import React from 'react';
import './Navbar.css';
import auth from "../Auth.js"


const Navbar = ({loggedStatus,changeStatus}) => {

  const logoutBtn = (e) => {
    e.preventDefault();
    auth.logout();
    changeStatus(false);
  };



  const formatStatus = () => {
        if (loggedStatus){
          return <li><a href="/#" onClick={logoutBtn}><button className="btn btn-lg btn-danger btn-block" type="submit">Одјави се</button></a></li>
        }
        else {
          return <li><a href="/login"><button className="btn btn-lg btn-primary btn-block" type="submit">Најави се</button></a></li>
        }
    
  }     
        
        return (
<nav className="navbar navbar-default">
  <div className="container-fluid">
    <div className="navbar-header">
      <a className="navbar-brand" href="/">WebSiteName</a>
    </div>
    <ul className="nav navbar-nav">
      <li className="active"><a href="https://google.com/">Home</a></li>
      <li><a href="https://google.com/">Page 1</a></li>
      <li><a href="https://google.com/">Page 2</a></li>
      <li><a href="https://google.com/">Page 3</a></li>
    </ul>
    <ul className="nav navbar-nav navbar-right">
      {formatStatus()}
    </ul>
  </div>
</nav>
  );
}

export default Navbar;
