import Navbar from './components/Navbar';
import Login from './components/Login';
import LoggedInRoute from './components/LoggedInRoute';
import Home from './components/Home';
import AddData from './components/AddData'
import Table from './components/FirmiTable'
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
          if(res.data.message!=="Authenticated"){
            setLoggedIn(false);
            setIsAdmin(false);
            setUsername("");
            
          }
        }
        )
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
          <Route path="/FirmiTable">
            <Table/>
          </Route>
          
          <LoggedInRoute exact path="/" loggedStatus={loggedIn} component={Home}></LoggedInRoute>
          <LoggedInRoute exact path="/dodadiData" loggedStatus={loggedIn} component={AddData}></LoggedInRoute>
          </BrowserRouter >
          
          </div>


);
}
