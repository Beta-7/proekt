
import React, { Component, Fragment, useState } from 'react';
import axios from 'axios';

import AddCompany from "./addData/AddCompany"
import UploadSensorData from "./addData/UploadSensorData"

axios.defaults.baseURL = 'http://localhost:5000';

export default class Login extends Component {
    
        render(){
    
        return (
            <div>
            <AddCompany/>
            <UploadSensorData/>
            </div>
    );
        }
}

