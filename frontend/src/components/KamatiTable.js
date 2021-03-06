import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable from '@material-table/core';


axios.defaults.baseUrl = 'http://localhost:5000';



export default function KamatiTable () {
    const [firmi, setFirmi] = useState([])

    useEffect(() => {
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      async function getData(){
      let firmiNiza = []
      let firmi = await axios.post("/firmi/zemiFirmiHelper",{},{withCredentials:true})
      console.log(firmi)
      for(let firma of firmi.data){
        firmiNiza[firma.id] = firma.name
      }

          
      setFirmi(firmiNiza)
    }


    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Име на фирма", field: "firmaid",
          validate: rowData => rowData.firmaid === undefined || rowData.firmaid === "" ? "Required" : true,
          filtering:true,
          lookup: {...firmi}
        },
        {
          title: "Фактура", field: "arhivskiBroj",
          validate: rowData => rowData.arhivskiBroj === undefined || rowData.arhivskiBroj === "" ? "Required" : true,
          filtering:true
        },
        {
          title: "Сума", field: 'suma',
          validate: rowData => rowData.suma === undefined || rowData.suma === "" ? "Required" : true,
          type: "numeric"
        },
        {
          title: "Рок", field: 'rok',
          validate: rowData => rowData.rok === undefined || rowData.rok === "" ? "Required" : true,
          type: 'date'
        },
        {
          title: "Платено на датум", field: 'platenoData',
          type: 'date'
        }
    ]
    
    
        return (
            <MaterialTable
              title="Камати"
              columns={columns}
              data={query=>new Promise((resolve,reject)=>{
                var field = undefined
                var dir = undefined
                if(query.orderBy === undefined){
                  field="id"
                  dir="desc"
                }else{
                  field = query.orderBy.field
                  dir = query.orderDirection
                }
                var response  = axios.post("/misc/getKamati",{
                    filters:query.filters,
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
        
                })

              }

              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                  axios.post("/misc/addKamata",{
                    firma:newRow.firmaid,
                    arhivskiBroj:newRow.arhivskiBroj,
                    suma:newRow.suma,
                    rok:newRow.rok,
                    platenoData:newRow.platenoData
                  },{withCredentials:true}).then(()=>{
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/misc/deleteKamata",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/misc/editKamata",{
                    id:oldRow.id,
                    firma:updatedRow.firmaid,
                    arhivskiBroj:updatedRow.arhivskiBroj,
                    suma:updatedRow.suma,
                    rok:updatedRow.rok,
                    platenoData:updatedRow.platenoData
                  },{withCredentials:true}).then(()=>{
                    resolve()
                  })
                })
      
              }}
              options={{
                paging:true,
                filtering:true,
                search:false,
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

