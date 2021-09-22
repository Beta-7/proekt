import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable from '@material-table/core';



axios.defaults.baseUrl = 'http://localhost:5000';



export default function NagradiTable () {



    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Шифра на агент", field: "agent",
          filtering:true,
          editable: false
        },
        {
          title: "Сума", field: "suma",
          filtering:false,
          editable: false
        },
        {
          title: "Месец", field: 'mesec',
          filtering:true,
          editable: false
        },
        {
          title: "Година", field: 'godina',
          filtering:true,
          editable: false
        },
        {
          title: "Фирма", field: 'firma',
          filtering:true,
          editable: false
        },
        {
          title: "Помирено", field: 'pomireno',
          validate: rowData => rowData.pomireno === undefined || rowData.pomireno === "" ? "Required" : true,
          type: 'boolean'
        }
    ]
    
    
        return (
            <MaterialTable
              title="Награди на агент базирани на потрошено количество енергија"
              columns={columns}
              data={query = new Promise((resolve, reject)=>{
                axios.post("/misc/GetNagradi",{},{withCredentials:true}).then((response)=>{
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
              
                editable={{onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/misc/updateNagrada",{
                    id:oldRow.id,
                    pomireno:updatedRow.pomireno
                  },{withCredentials:true}).then(()=>{
                    
                    getData()
                    resolve()
                  })
                })}}
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

