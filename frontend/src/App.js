import Navbar from './components/Navbar';
import Login from './components/Login';
import ProtectedRoute from './components/LoggedInRoute';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import React, { useState } from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


export default function App () {
      const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("isAuthenticated")));
      const [isAdmin] = useState(JSON.parse(localStorage.getItem("isAdmin")));
      const changeStatus = (newLoggedInStatus) =>{
          setLoggedIn(newLoggedInStatus);
      }
      
      return (
          <div>
            <Navbar loggedStatus={loggedIn} changeStatus={setLoggedIn}/>
          <BrowserRouter>
          <Switch>
          <Route path='/login' component={() => <Login loggedStatus={loggedIn} changeStatus={changeStatus} />}/>
          
          
          <ProtectedRoute exact path="/home" loggedStatus={loggedIn} isAdmin={isAdmin} component={Home}></ProtectedRoute>
          <ProtectedRoute exact path="/" loggedStatus={loggedIn} isAdmin={isAdmin} component={Home}></ProtectedRoute>
          <ProtectedRoute exact path="/adminpanel" loggedStatus={loggedIn} isAdmin={isAdmin} component={AdminPanel}></ProtectedRoute>
          <Route path="*" component={() => "404 NOT FOUND"} />
          </Switch>
          </BrowserRouter >
          </div>


);
}
