import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function LoggedInRoute({loggedStatus, component: Component, ...restOfProps }){ 
  

  return (
    <Route
      {...restOfProps}
      render={(props) =>{
        if(loggedStatus){
          return (<Component {...props} />);
        }
        else{
          return(<Redirect to="/login" /> );
        }

      }
    }
    />
  );
}
