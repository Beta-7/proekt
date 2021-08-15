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




export default function StornoTable(props) {
    const [data, setData] = useState([])


    useEffect(() => {
      console.log(props.data)
      setData(props.data)
      console.log(data)
      getData()
      }, [])



      
       function getData(){
          axios.post("/storno/getStornos",{},{withCredentials:true}).then((response)=>{
              //setData(response.data)
              //console.log(response.data)
          })
        }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "brojNaMernaTocka", field: "brojNaMernaTocka",
          validate: rowData => rowData.brojNaMernaTocka === undefined || rowData.brojNaMernaTocka === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "mesecNaFakturiranje", field: "mesecNaFakturiranje",
          validate: rowData => rowData.mesecNaFakturiranje === undefined || rowData.mesecNaFakturiranje === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "tarifa", field: 'tarifa',
          validate: rowData => rowData.tarifa === undefined || rowData.tarifa === "" ? "Required" : true,
        },
        {
            title: "datumNaPocetokNaMerenje", field: 'datumNaPocetokNaMerenje',
            validate: rowData => rowData.datumNaPocetokNaMerenje === undefined || rowData.datumNaPocetokNaMerenje === "" ? "Required" : true,
          },
          {
            title: "datumNaZavrshuvanjeNaMerenje", field: 'datumNaZavrshuvanjeNaMerenje',
            validate: rowData => rowData.datumNaZavrshuvanjeNaMerenje === undefined || rowData.datumNaZavrshuvanjeNaMerenje === "" ? "Required" : true,
          },
          {
            title: "pocetnaSostojba", field: 'pocetnaSostojba',
            validate: rowData => rowData.pocetnaSostojba === undefined || rowData.pocetnaSostojba === "" ? "Required" : true,
          },
          {
            title: "krajnaSostojba", field: 'krajnaSostojba',
            validate: rowData => rowData.krajnaSostojba === undefined || rowData.krajnaSostojba === "" ? "Required" : true,
          },
          {
            title: "kolicina", field: 'kolicina',
            validate: rowData => rowData.kolicina === undefined || rowData.kolicina === "" ? "Required" : true,
          },
          {
            title: "multiplikator", field: 'multiplikator',
            validate: rowData => rowData.multiplikator === undefined || rowData.multiplikator === "" ? "Required" : true,
          },
          {
            title: "vkupnoKolicina", field: 'vkupnoKolicina',
            validate: rowData => rowData.vkupnoKolicina === undefined || rowData.vkupnoKolicina === "" ? "Required" : true,
          },
          {
            title: "nebitno", field: 'nebitno',
            validate: rowData => rowData.nebitno === undefined || rowData.nebitno === "" ? "Required" : true,
          },
          {
            title: "brojNaMernoMesto", field: 'brojNaMernoMesto',
            validate: rowData => rowData.brojNaMernoMesto === undefined || rowData.brojNaMernoMesto === "" ? "Required" : true,
          },
          {
            title: "brojNaBroilo", field: 'brojNaBroilo',
            validate: rowData => rowData.brojNaBroilo === undefined || rowData.brojNaBroilo === "" ? "Required" : true,
          },
          {
            title: "nebitno2", field: 'nebitno2',
            validate: rowData => rowData.nebitno2 === undefined || rowData.nebitno2 === "" ? "Required" : true,
          },
          {
            title: "datumNaIzrabotkaEVN", field: 'datumNaIzrabotkaEVN',
            validate: rowData => rowData.datumNaIzrabotkaEVN === undefined || rowData.datumNaIzrabotkaEVN === "" ? "Required" : true,
          },
          {
            title: "pomireno", field: 'pomireno',
            validate: rowData => rowData.pomireno === undefined || rowData.pomireno === "" ? "Required" : true,
            type: 'boolean'
          },
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
                  axios.post("/storno/dodadiStorno",{
                    brojNaMernaTocka:newRow.brojNaMernaTocka,
                    mesecNaFakturiranje:newRow.mesecNaFakturiranje,
                    tarifa:newRow.tarifa,
                    datumNaPocetokNaMerenje:newRow.datumNaPocetokNaMerenje,
                    datumNaZavrshuvanjeNaMerenje:newRow.datumNaZavrshuvanjeNaMerenje,
                    pocetnaSostojba:newRow.pocetnaSostojba,
                    krajnaSostojba:newRow.krajnaSostojba,
                    kolicina:newRow.kolicina,
                    multiplikator:newRow.multiplikator,
                    vkupnoKolicina:newRow.vkupnoKolicina,
                    nebitno:newRow.nebitno,
                    brojNaMernoMesto:newRow.brojNaMernoMesto,
                    brojNaBroilo:newRow.brojNaBroilo,
                    nebitno2:newRow.nebitno2,
                    datumNaIzrabotkaEVN:newRow.datumNaIzrabotkaEVN,
                    pomireno:newRow.pomireno
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/storno/izbrisiStorno",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/storno/promeniStorno",{
                    id:oldRow.id,
                    brojNaMernaTocka:updatedRow.brojNaMernaTocka,
                    mesecNaFakturiranje:updatedRow.mesecNaFakturiranje,
                    tarifa:updatedRow.tarifa,
                    datumNaPocetokNaMerenje:updatedRow.datumNaPocetokNaMerenje,
                    datumNaZavrshuvanjeNaMerenje:updatedRow.datumNaZavrshuvanjeNaMerenje,
                    pocetnaSostojba:updatedRow.pocetnaSostojba,
                    krajnaSostojba:updatedRow.krajnaSostojba,
                    kolicina:updatedRow.kolicina,
                    multiplikator:updatedRow.multiplikator,
                    vkupnoKolicina:updatedRow.vkupnoKolicina,
                    nebitno:updatedRow.nebitno,
                    brojNaMernoMesto:updatedRow.brojNaMernoMesto,
                    brojNaBroilo:updatedRow.brojNaBroilo,
                    nebitno2:updatedRow.nebitno2,
                    datumNaIzrabotkaEVN:updatedRow.datumNaIzrabotkaEVN,
                    pomireno:updatedRow.pomireno
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                })
      
              }}
                options={{
                  actionsColumnIndex: -1, addRowPosition: "first",
                  headerStyle: {
                    fontSize: 13,
                  }
                }}
            />
    );
        



        
}

