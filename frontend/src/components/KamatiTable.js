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


    useEffect(() => {
      getData()
      }, [])

       function getData(){
          axios.post("/misc/getKamati",{},{withCredentials:true}).then((response)=>{
              setData(response.data)
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
          filtering:false
        },
        {
          title: "Фактура", field: "fakturaStoKasniId",
          validate: rowData => rowData.fakturaStoKasniId === undefined || rowData.fakturaStoKasniId === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Сума", field: 'suma',
          validate: rowData => rowData.suma === undefined || rowData.suma === "" ? "Required" : true,
        },
        {
          title: "Рок", field: 'rok',
          validate: rowData => rowData.rok === undefined || rowData.rok === "" ? "Required" : true,
        },
        {
          title: "Платено на датум", field: 'platenoData',
          validate: rowData => rowData.platenoData === undefined || rowData.platenoData === "" ? "Required" : true,
        }
    ]
    
    
        return (
            <MaterialTable
              title="Кориснички сметки"
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

