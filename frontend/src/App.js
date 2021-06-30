import Navbar from './components/Navbar';
import Login from './components/Login';
import LoggedInRoute from './components/LoggedInRoute';
import AdminRoute from './components/AdminRoute';
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
          
          
          <LoggedInRoute exact path="/home" loggedStatus={loggedIn} component={Home}></LoggedInRoute>
          <LoggedInRoute exact path="/" loggedStatus={loggedIn} isAdmin={isAdmin} component={Home}></LoggedInRoute>
          <AdminRoute exact path="/adminpanel" isAdmin={isAdmin} component={AdminPanel}></AdminRoute>
          <Route path="*" component={() => "404 NOT FOUND"} />
          </Switch>
          </BrowserRouter >
          </div>


);
}
