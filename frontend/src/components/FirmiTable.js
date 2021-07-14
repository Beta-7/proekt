import MUIDataTable from "mui-datatables";
import React, {forwardRef, useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable, { MaterialTableProps } from 'material-table';
import { TablePagination, TablePaginationProps } from '@material-ui/core';


//Fix to the broken pagination
function PatchedPagination(props) {
  const {
    ActionsComponent,
    onChangePage,
    onChangeRowsPerPage,
    ...tablePaginationProps
  } = props;

  return (
    <TablePagination
      {...tablePaginationProps}
      // @ts-expect-error onChangePage was renamed to onPageChange
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={(subprops) => {
        const { onPageChange, ...actionsComponentProps } = subprops;
        return (
          // @ts-expect-error ActionsComponent is provided by material-table
          <ActionsComponent
            {...actionsComponentProps}
            onChangePage={onPageChange}
          />
        );
      }}
    />
  );
}


axios.defaults.baseURL = 'http://localhost:5000';



export default function Table () {
    const [data, setData] = useState([])
    const [vraboteni, setVraboteni] = useState([])
    const [keyUser, setKeyUser] = useState([])
    

    useEffect(() => {
      getVraboteni()
      getKompanii()
      }, [])
    async function getKompanii(){
        axios.post("/firmi/zemiFirmi",{},{withCredentials:true}).then((response)=>{
          var c = 0  
          console.log(keyUser)
          let tmp = JSON.parse(JSON.stringify(response.data.rows));
          for( var i in response.data.rows ){
              tmp[c].agent = keyUser[response.data.rows[c].agent];
              c+=1;
            }
            setData(tmp)
        })
      }
       async function getVraboteni(){
          axios.post("/auth/getUsers",{},{withCredentials:true}).then((response)=>{
            var users = {} 
            response.data.map((user,idx)=>{
                users[idx] = user.username  
              })
              
              var ret = {};
              for(var key in users){
                ret[users[key]] = key;
              }
              setKeyUser(ret);
              console.log(users)
              setVraboteni(users)
          })
          
      }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Ime", field: "name",
          validate: rowData => rowData.name === undefined || rowData.name === "" ? "Required" : true
        },
        {
          title: "Broj", field: "broj",
          validate: rowData => rowData.broj === undefined || rowData.broj === "" ? "Required" : true
        },
        {
          title: "Agent", field: 'agent',
          validate: rowData => rowData.agent === undefined || rowData.agent === "" ? "Required" : true,
          lookup:{...vraboteni}
        }]
    
    
        return (
            <MaterialTable
              title="Student Details"
              columns={columns}
              data={data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                  // console.log(vraboteni[newRow.agent])
                  axios.post("/firmi/dodadiFirma",{
                    name:newRow.name,
                    broj:newRow.broj,
                    agent:vraboteni[newRow.agent]
                  },{withCredentials:true}).then(()=>{
                    getKompanii()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/firmi/izbrisiFirma",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    getKompanii()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
                  axios.post("/firmi/promeniFirma",{
                    id:oldRow.id,
                    name:updatedRow.name,
                    broj:updatedRow.broj,
                    agent:vraboteni[updatedRow.agent]
                  },{withCredentials:true}).then(()=>{
                    getKompanii()
                    resolve()
                  })
                })
      
              }}
                options={{
                  actionsColumnIndex: -1, addRowPosition: "first"
                }}
            />
    );
        



        
}

