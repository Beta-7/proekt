
import React from 'react';
import './Navbar.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';
class Navbar extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        };
        this.getButton = this.getButton.bind(this);
        this.getButton();
      }
  
      getButton(){

    
            
      }

    render = () =>{

        const user = (
            <li><a href="https://google.com/"><span className="glyphicon glyphicon-user"></span> Logout</a></li>
            )
    
        const guest = (
            <li><a href="https://google.com/"><span className="glyphicon glyphicon-user"></span> Login</a></li>
            )
        
        
        
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
      { this.getButton? user : guest}
    </ul>
  </div>
</nav>
  );
}}

export default Navbar;
