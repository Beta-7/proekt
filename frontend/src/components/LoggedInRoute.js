import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function ProtectedRoute({loggedStatus, component: Component, ...restOfProps }){ 
  

  return (
    <Route
      {...restOfProps}
      render={(props) =>{
          console.log("status" +loggedStatus)
          if(loggedStatus)
          return (<Component {...props} />)
          else{
              return(<Redirect to="/login" /> )
      
      }
      }
    }
    />
  );
}
