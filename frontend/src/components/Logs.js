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
          title: "Време", field: 'createdAt',
          filtering:true,
          editable: false
        },
        {
          title: "Извршител на акција", field: "actor",
          filtering:true,
          editable: false
        },
        {
          title: "Порака", field: "message",
          filtering:false,
          editable: false
        },
        {
          title: "Акција извршена врз", field: 'actedon',
          filtering:true,
          editable: false
        }
        
    ]
    
    
        return (
            <MaterialTable
              title="Награди на агент базирани на потрошено количество енергија"
              columns={columns}
              
              data={query => new Promise((resolve, reject)=>{
                var field = null
                var dir = null
                if(query.orderBy === undefined){
                  field="id"
                  dir="desc"
                }
                axios.post("/misc/GetLogs",{
                  search: query.search, 
                  pageSize:query.pageSize, 
                  page:query.page,
                  sortField:field,
                  orderDirection:dir
                },{withCredentials:true}).then((response)=>{
                  resolve({
                    data: response.data.rows,
                    page: query.page,
                    totalCount: response.data.count,
                });
            })
              })}

              
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

