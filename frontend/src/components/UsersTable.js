import React, {useState, useEffect} from 'react';
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




export default function FirmiTable () {
    const [data, setData] = useState([])
    const [vraboteni, setVraboteni] = useState([])


    useEffect(() => {
      getData()
      }, [])



      
       function getData(){
         var users = {}
         var usersid = {}
          axios.post("/auth/getUsers",{},{withCredentials:true}).then((response)=>{
              setData(response.data)
              setVraboteni(users)
          })



        }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "username", field: "username",
          validate: rowData => rowData.username === undefined || rowData.username === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "ime", field: "ime",
          validate: rowData => rowData.ime === undefined || rowData.ime === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "prezime", field: 'prezime',
          validate: rowData => rowData.prezime === undefined || rowData.prezime === "" ? "Required" : true,
        },
        {
          title: "Admin", field: 'isAdmin',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
          type: 'boolean'
        }
    ]
    
    
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
                  axios.post("/user/dodadiUser",{
                    username:newRow.username,
                    ime:newRow.ime,
                    prezime:newRow.prezime,
                    isAdmin:newRow.isAdmin  
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/user/izbrisiUser",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/user/promeniUser",{
                    id:oldRow.id,
                    username:updatedRow.username,
                    ime:updatedRow.ime,
                    prezime:updatedRow.prezime,
                    isAdmin:updatedRow.isAdmin
                  },{withCredentials:true}).then(()=>{
                    console.log("asdasddsa")
                    getData()
                    resolve()
                  })
                })
      
              }}
                options={{
                  actionsColumnIndex: -1, addRowPosition: "first",

                }}
            />
    );
        



        
}

