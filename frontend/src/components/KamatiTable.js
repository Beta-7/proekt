import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';


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


axios.defaults.baseUrl = 'http://localhost:5000';



export default function KamatiTable () {
    const [data, setData] = useState([])
    const [firmi, setFirmi] = useState([])

    useEffect(() => {
      getData()
      }, [])

       function getData(){
          axios.post("/misc/getKamati",{},{withCredentials:true}).then((response)=>{
              setData(response.data)
          })
          var firmiNiza = []
          axios.post("/firmi/zemiFirmi",{},{withCredentials:true}).then((firmi)=>{
              firmi.data.rows.forEach((firma)=>{
                 firmiNiza[firma.id] = firma.name 
                 })
                 
               setFirmi(firmiNiza)
          
        })
      }
    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Име на фирма", field: "firmaid",
          validate: rowData => rowData.firmaid === undefined || rowData.firmaid === "" ? "Required" : true,
          filtering:false,
          lookup: {...firmi}
        },
        {
          title: "Фактура", field: "arhivskiBroj",
          validate: rowData => rowData.arhivskiBroj === undefined || rowData.arhivskiBroj === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Сума", field: 'suma',
          validate: rowData => rowData.suma === undefined || rowData.suma === "" ? "Required" : true,
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
              data={data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                  axios.post("/misc/addKamata",{
                    firma:newRow.firmaid,
                    arhivskiBroj:newRow.arhivskiBroj,
                    suma:newRow.suma,
                    rok:newRow.rok  
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/misc/deleteKamata",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    getData()
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
                    rok:updatedRow.rok  
                  },{withCredentials:true}).then(()=>{
                    getData()
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

