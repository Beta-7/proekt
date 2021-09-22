import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable from '@material-table/core';




axios.defaults.baseUrl = 'http://localhost:5000';



export default function FirmiTable () {



    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Корисничко име", field: "username",
          validate: rowData => rowData.username === undefined || rowData.username === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Име", field: "ime",
          validate: rowData => rowData.ime === undefined || rowData.ime === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Презиме", field: 'prezime',
          validate: rowData => rowData.prezime === undefined || rowData.prezime === "" ? "Required" : true,
        },
        {
          title: "Администратор", field: 'isAdmin',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
          type: 'boolean'
        }
    ]
    
    
        return (
            <MaterialTable
              title="Кориснички сметки"
              columns={columns}
              data={query => new Promise((resolve, reject)=>{
                axios.post("/auth/getUsers",{
                  search: query.search, 
                  pageSize:query.pageSize, 
                  page:query.page,
                  sortField:field,
                  orderDirection:dir},{withCredentials:true}).then((response)=>{
                  resolve({
                    data: response.data.rows,
                    page: query.page,
                    totalCount: response.data.count,
                });
              })
              })}
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
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/user/izbrisiUser",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
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
                    resolve()
                  })
                })
      
              }}
              options={{
                paging:true,
                pageSize:20,       // make initial page size
                emptyRowsWhenPaging: true,   //to make page size fix in case of less data rows
                pageSizeOptions:[5,10,20],
                actionsColumnIndex: -1, addRowPosition: "first",
                headerStyle: {
                  fontSize: 13,
                }
              }}
                
            />
    );
        



        
}

