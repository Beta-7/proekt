import React, { useEffect, useState } from 'react';

import './Navbar.css';
import auth from "../Auth.js"
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";
import { Link } from '@material-ui/core';

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));


const styles = {
  instMenu: {
    marginTop: 15,
    marginBottom: 0,
    display: 'inline-flex'
  }
};


const Navbar = ({loggedStatus,changeStatus, route, setRoute }) => {

  const [active, setActive] = useState([0,0,0,0])
  const logoutBtn = (e) => {
    e.preventDefault();
    auth.logout();
    changeStatus(false);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
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
          return  <div>
          <ul className="nav navbar-nav">
          <div style={{padding: "3px"}}></div>
          <li className={active[2]?"active":""}><a href="/wizard" onClick={setRoute("/wizard")}>Волшебник</a></li>
            <li className={active[1]?"active":""}>
      
            
            <div> 
                          <Button style={{fontSize: "13px",textTransform: 'none', height: "50px", padding: "15px",}} onClick={handleClick1}>
                            Податоци ▼
                          </Button>
                          <StyledMenu
                            id="simple-menu"
                            anchorEl={anchorE2}
                            keepMounted
                            open={Boolean(anchorE2)}
                            onClose={handleClose}
                          >
                            <a href="/dodadiData" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Додади Податоци</MenuItem></a>
                            <a href="/uploadStornoData" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Сторно</MenuItem></a>
                            <a href="/firmiTable" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Фирми</MenuItem></a>
                            <a href="/" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Фактури</MenuItem></a>
                          </StyledMenu>
                        </div>
      
      
            </li>
            

          </ul>
          <ul className="nav navbar-nav navbar-right" style={{padding: "0px"}}>
               
                      <li>
                      <div> 
                          <Button style={{fontSize: "13px",textTransform: 'none', height: "46px", padding: "15px", position: 'relative', top: '9px'}} onClick={handleClick}>
                            Систем ▼
                          </Button>
                          <StyledMenu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <a href="/usersTable" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Корисници</MenuItem></a>
                            <a href="/logs" style={{ textDecoration: 'none', color: 'black' }}><MenuItem style={{ fontSize: '13px' }} onClick={handleClose}>Логови</MenuItem></a>
                          </StyledMenu>
                        </div>
                      </li>
                        <li><a href="/#" onClick={logoutBtn} style={{ textDecoration: 'none', padding: '9px' }}  ><button className="btn btn-lg btn-danger btn-block" type="submit">Одјави се</button></a></li>
                        </ul>
          </div>
        }
        else {
          return <ul className="nav navbar-nav navbar-right" ><li><a href="/login" style={{ textDecoration: 'none', padding: '9px' }}><button className="btn btn-lg btn-primary btn-block" type="submit">Најави се</button></a></li></ul>
        }
    
  }     
        
        return (
          <nav className="navbar navbar-default">

  <div className="container-fluid">
    <div className="navbar-header">
      <div style={{padding: "3px"}}></div>
      <a className="navbar-brand" href="/">EnergyON</a>
    </div>
    
      {formatStatus()}
  </div>
</nav>
  );
}

export default Navbar;
