
import React, { Component} from 'react';
import './Login.css';
import {Redirect} from "react-router-dom";

import auth from "../Auth.js"


export default class Login extends Component {
    
    constructor() {
        super();
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.showError = this.showError.bind(this);
    }
    state = {
        username:"",
        password:"",
        error:""

    }
    setLoggedIn = (status)=>{
        this.props.changeStatus (status)
    }

     onSubmitForm = async e => {
        e.preventDefault();
        
            auth.login(this.state.username, this.state.password).then(()=>{
                this.setState({error:"false"});
                    this.setLoggedIn(true);
                
            }).catch(()=>{
                this.setState({error:"true"})

            })
            
         
        
    }
     
        render(){
        return (
            <div className="login">
            <form className="form-signin" onSubmit={this.onSubmitForm}>
            
            <h1 className="h3 mb-3 font-weight-normal">Најави се</h1>
            <label htmlFor="inputEmail" className="sr-only">Корисничко име</label>
            <input type="text" id="inputEmail" className="form-control" placeholder="Корисничко име" required autoFocus onChange={e => this.setState({"username":e.target.value})} />
            <label htmlFor="inputPassword" className="sr-only">Лозинка</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Лозинка" required onChange={e => this.setState({"password":e.target.value})} />
            <button className="btn btn-lg btn-primary btn-block" type="submit">Најави се</button>
            {this.showError()}
          </form>
          </div>
    );
        }


        showError = () =>{
            if(this.props.loggedStatus ===true){
                return <Redirect to="/"/> 
            }
            if(this.state.error==="true"){
                return <div className="alert alert-danger" role="alert"> Погрешно корисничко име и/ли лозинка! </div>
            }else if(this.state.error==="false"){
                return <Redirect to="/"/> 
            }
        }
}

