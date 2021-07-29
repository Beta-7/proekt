import React, { useEffect, useState } from 'react';

import './Navbar.css';
import auth from "../Auth.js"


const Navbar = ({loggedStatus,changeStatus, route, setRoute }) => {

  const [active, setActive] = useState([0,0,0,0])
  const logoutBtn = (e) => {
    e.preventDefault();
    auth.logout();
    changeStatus(false);
  };
  useEffect(() => {
   var loc = window.location.pathname
   console.log(loc)
   switch (loc) {
    case "/":
      var newState=active;
      newState[0]=1
      setActive([...newState])
      return;
    case "/dodadiData":
      var newState=active;
      newState[1]=1
      setActive([...newState])
      return
    case "/wizard":
      var newState=active;
      newState[2]=1
      setActive([...newState])
      return
    case 3:
      var newState=active;
      newState[3]=1
      setActive([...newState])
      return
    default:
      return ;
  }


    }, [])


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
      <li className={active[1]?"active":""}><a href="/dodadiData" onClick={setRoute("/dodadiData")}>Додади податоци</a></li>
      <li className={active[2]?"active":""}><a href="/wizard" onClick={setRoute("/wizard")}>Волшебник</a></li>
      
    </ul>
    <ul className="nav navbar-nav navbar-right">
      {formatStatus()}
    </ul>
  </div>
</nav>
  );
}

export default Navbar;
