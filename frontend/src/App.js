import Navbar from './components/Navbar';
import Login from './components/Login';
import ProtectedRoute from './components/LoggedInRoute';
import Home from './components/Home';
import React, { useState } from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


export default function App () {
      const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("isAuthenticated")));
  
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

          
          <ProtectedRoute exact path="/" loggedStatus={loggedIn} component={Home}></ProtectedRoute>
          </BrowserRouter >
          
          </div>


);
}
