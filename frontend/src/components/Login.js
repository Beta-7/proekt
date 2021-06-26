
import React, { Fragment, useState } from 'react';
import {Redirect} from "react-router-dom";
import './Login.css';

import axios from 'axios';


import auth from "../Auth.js"

axios.defaults.baseURL = 'http://localhost:5000';

const Login =  () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            auth.login(username, password)
            // this.props.history.push("/");
        } catch (err) {
            console.error(err);
        }
    }
  
        return (
            <div className="login">
            <form className="form-signin" onSubmit={onSubmitForm}>
            
            <h1 className="h3 mb-3 font-weight-normal">Најави се</h1>
            <label htmlFor="inputEmail" className="sr-only">Корисничко име</label>
            <input type="text" id="inputEmail" className="form-control" placeholder="Корисничко име" required autoFocus onChange={e => setUsername(e.target.value)} />
            <label htmlFor="inputPassword" className="sr-only">Лозинка</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Лозинка" required onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-lg btn-primary btn-block" type="submit">Најави се</button>
            
          </form>
          </div>
    );
}

export default Login;
