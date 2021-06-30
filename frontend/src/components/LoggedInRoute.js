import React from "react";
import { Redirect, Route,  Switch } from "react-router-dom";

export default function ProtectedRoute({loggedStatus, isAdmin, component: Component, ...restOfProps }){ 
  


  return (
    <Route
      {...restOfProps}
      render={(props) =>{
        
        if(loggedStatus){
            if({...props}.location.pathname === "/home" || {...props}.location.pathname === "/"){
              return ( <Component {...props} />)
            }
          }
          else{
            return(<Redirect to="/login" /> )
          }
          //console.log(isAdmin);
          if(loggedStatus && isAdmin){
            if({...props}.location.pathname === "/adminpanel"){
              return (<Component {...props} />)
            }
          }
          else{
            return(<Redirect to="/home" /> )}   
          }
    }
    />
  );
}
