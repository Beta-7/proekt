import Navbar from './components/Navbar';
import Login from './components/Login';
import LoggedInRoute from './components/LoggedInRoute';
import Home from './components/Home';
import AddData from './components/AddData'
import FirmiTable from './components/FirmiTable'
import UsersTable from './components/UsersTable'
import BroilosTable from './components/BroilosTable'
import MernaTocka from './components/MerniTockiTable'
import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


export default function App () {
      const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("isAuthenticated")));
      const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("isAdmin")));
      const [username, setUsername] = useState(localStorage.getItem("Username"));

      useEffect(() => {
        axios.post("/auth/whoami",{},{withCredentials:true}).then((res)=>{
          console.log("Logged in with user "+res.data.username)
          if(res.data.message!=="Authenticated"){
            setLoggedIn(false);
            localStorage.setItem("isAuthenticated",false);
            setIsAdmin(false);
            localStorage.setItem("isAdmin",false);
            setUsername("");
            localStorage.setItem("Username","");
            
          }
        })
        }, [])


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
          <Route path="/Firmitable">
            <FirmiTable/>
          </Route>

          <Route path="/Userstable">
            <UsersTable/>
          </Route>

          <Route path="/broilosTable">
            <BroilosTable/>
          </Route>

          <Route path="/MerniTockiTable">
            <MernaTocka/>
          </Route>

          <LoggedInRoute exact path="/" loggedStatus={loggedIn} component={Home}></LoggedInRoute>
          <LoggedInRoute exact path="/dodadiData" loggedStatus={loggedIn} component={AddData}></LoggedInRoute>
          </BrowserRouter >
          
          </div>


);
}
