import Navbar from './components/Navbar';
import Login from './components/Login';
import LoggedInRoute from './components/LoggedInRoute';
import Home from './components/Home';
import AddData from './components/AddData'
import FirmiTable from './components/wizard/FirmiTable'
import UsersTable from './components/UsersTable'
import BroilosTable from './components/BroilosTable'
import MernaTocka from './components/wizard/MerniTockiTable'
import WizardRoot from './components/wizard/WizardRoot'
import Nagradi from './components/Nagradi'
import Logs from './components/Logs'
import UploadStornoData from './components/wizard/UploadStornoData'
import FakturiTable from './components/wizard/FakturiTable'
import GenerirajFakturi from './components/wizard/GenerirajFakturi'
import DodadiMerniTocki from './components/DodadiMerniTocki'
import KamatiTable from "./components/KamatiTable"
import React, { useState, useEffect } from 'react';
import {Redirect, BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';

import axios from 'axios';
import ZelenaEnergijaData from './components/wizard/ZelenaEnergijaData';
axios.defaults.baseUrl = 'http://10.30.91.51';


export default function App () {
      const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("isAuthenticated")));
      const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("isAdmin")));
      const [username, setUsername] = useState(localStorage.getItem("Username"));
      const [route, setRoute]=useState("")
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
            <Navbar loggedStatus={loggedIn} changeStatus={setLoggedIn} route={route} setRoute={setRoute}/>
          <BrowserRouter>
          <Switch>
          <Route
          path='/login'
          component={() => <Login loggedStatus={loggedIn} changeStatus={changeStatus} />}
          />

          <LoggedInRoute exact path="/Firmitable" loggedStatus={loggedIn} component={FirmiTable}></LoggedInRoute>
          <LoggedInRoute exact path="/Userstable" loggedStatus={loggedIn} component={UsersTable}></LoggedInRoute>
          <LoggedInRoute exact path="/broilosTable" loggedStatus={loggedIn} component={BroilosTable}></LoggedInRoute>
          <LoggedInRoute exact path="/MerniTockiTable" loggedStatus={loggedIn} component={MernaTocka}></LoggedInRoute>
          <LoggedInRoute exact path="/zelena" step={4} stepState={()=>{}} editStep={()=>{}} loggedStatus={loggedIn} component={ZelenaEnergijaData}></LoggedInRoute>
          <LoggedInRoute exact path="/wizard" loggedStatus={loggedIn} component={WizardRoot}></LoggedInRoute>
          <LoggedInRoute exact path="/nagradi" loggedStatus={loggedIn} component={Nagradi}></LoggedInRoute>
          <LoggedInRoute exact path="/logs" loggedStatus={loggedIn} component={Logs}></LoggedInRoute>
          <LoggedInRoute exact path="/FakturiTable" loggedStatus={loggedIn} component={FakturiTable}></LoggedInRoute>
          <LoggedInRoute exact path="/UploadStornoData" loggedStatus={loggedIn} component={UploadStornoData}></LoggedInRoute>
          <LoggedInRoute exact path="/GenerirajFakturi" loggedStatus={loggedIn} component={GenerirajFakturi}></LoggedInRoute>
          <LoggedInRoute exact path="/kamatiTable" loggedStatus={loggedIn} component={KamatiTable}></LoggedInRoute>
          <LoggedInRoute exact path="/" loggedStatus={loggedIn} component={Home}></LoggedInRoute>
          <LoggedInRoute exact path="/dodadiData" loggedStatus={loggedIn} component={AddData}></LoggedInRoute>
          <LoggedInRoute exact path="/merniTocki" loggedStatus={loggedIn} component={DodadiMerniTocki}></LoggedInRoute>
          <Redirect to="/" />
          </Switch>
          </BrowserRouter >
          
          </div>


);
}
