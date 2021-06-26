import Navbar from './components/Navbar';
import Login from './components/Login';
import './App.css';
import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

class App extends React.Component {

  state = {};

  componentDidMount () {

    axios.post('/auth/whoami',{},{withCredentials:true})
              .then(function (response) {
                  if(response.data.message==="Unauthenticated"){
                     this.setState({isLoggedIn: false})
                    console.log("Unauth")
                    return false;
                    }
                  else{
                    this.setState({isLoggedIn: true})
                       console.log("auth")
                       return true;
                  }
                
              })
              .catch(function (error) {
                console.error(error);
              });
  }

  render(){
      return (
          <div>
            <Navbar/>
          <BrowserRouter>
          <Route path="/login" component={Login}/>
          </BrowserRouter>
            
          
          </div>


);
}}

export default App;