import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function AdminRoute({isAdmin, component: Component, ...restOfProps }){ 
  return (
    <Route
      {...restOfProps}
      render={(props) =>{
        if(isAdmin){
          return (<Component {...props} />);
        }
        else{
          return(<Redirect to="/home" /> );
        }

      }
    }
    />
  );
}
