import Navbar from './components/Navbar';
import Login from './components/Login';
import LoggedInRoute from './components/LoggedInRoute';
import Home from './components/Home';
import React, { useState } from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


export default function App () {
      const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("isAuthenticated")));
      const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("isAdmin")));
      const [username, setUsername] = useState(localStorage.getItem("Username"));

      const changeStatus = (newLoggedInStatus) =>{
          setLoggedIn(newLoggedInStatus);
      }
      return (
          <div>
            <Navbar loggedStatus={loggedIn} changeStatus={setLoggedIn}/>
          <BrowserRouter>
          <Route
          path='/login'
          component={() => <Login loggedStatus={loggedIn} changeStatus={changeStatus} />}
          />

          
          <LoggedInRoute exact path="/" loggedStatus={loggedIn} component={Home}></LoggedInRoute>
          </BrowserRouter >
          
          </div>


);
}
