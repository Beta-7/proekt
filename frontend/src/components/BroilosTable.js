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
          axios.post("/broilo/getBroilos",{},{withCredentials:true}).then((response)=>{
              console.log(response.data)
                setData(response.data)
              
          })



        }

    

    

    const columns = [
        { title: "id", field: "id",
         defaultSort:"desc"
         },
        {
          title: "brojMernaTocka", field: "brojMernaTocka",
          validate: rowData => rowData.username === undefined || rowData.username === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "mesec", field: "mesec",
          validate: rowData => rowData.ime === undefined || rowData.ime === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "tarifa", field: 'tarifa',
          validate: rowData => rowData.prezime === undefined || rowData.prezime === "" ? "Required" : true,
        },
        {
          title: "datumPocetok", field: 'datumPocetok',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "datumKraj", field: 'datumKraj',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "pocetnaSostojba", field: 'pocetnaSostojba',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "krajnaSostojba", field: 'krajnaSostojba',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "kolicina", field: 'kolicina',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "multiplikator", field: 'multiplikator',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "vkupnoKolicina", field: 'vkupnoKolicina',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "nebitno", field: 'nebitno',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "brojMernoMesto", field: 'brojMernoMesto',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "brojBroilo", field: 'brojBroilo',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "prazno", field: 'prazno',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "datumOdEvn", field: 'datumOdEvn',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
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

