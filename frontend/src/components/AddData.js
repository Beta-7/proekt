
import React, { Component} from 'react';
import axios from 'axios';

import AddCompany from "./addData/AddCompany"
import UploadSensorData from "./addData/UploadSensorData"
import BroilosTable from "./BroilosTable"
import FirmiTable from "./FirmiTable"
import UsersTable from "./UsersTable"
import ZelenaEnergijaData from "./ZelenaEnergijaData"
axios.defaults.baseURL = 'http://localhost:5000';

export default class Login extends Component {
    
        render(){
    
        return (
            <div>
            {/* <AddCompany/> */}
            <UploadSensorData/>
            <BroilosTable/>
            <ZelenaEnergijaData/>
            {/* <FirmiTable/> */}
            {/* <UsersTable/> */}
            </div>
    );
        }
}

