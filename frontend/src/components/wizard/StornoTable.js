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



    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Број на мерна точка", field: "brojNaMernaTocka",
          validate: rowData => rowData.brojNaMernaTocka === undefined || rowData.brojNaMernaTocka === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Месец на фактурирање", field: "mesecNaFakturiranje",
          validate: rowData => rowData.mesecNaFakturiranje === undefined || rowData.mesecNaFakturiranje === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Тарифа", field: 'tarifa',
          validate: rowData => rowData.tarifa === undefined || rowData.tarifa === "" ? "Required" : true,
        },
        {
            title: "Почеток на мерење", field: 'datumNaPocetokNaMerenje',
            validate: rowData => rowData.datumNaPocetokNaMerenje === undefined || rowData.datumNaPocetokNaMerenje === "" ? "Required" : true,
          },
          {
            title: "Крај на мерење", field: 'datumNaZavrshuvanjeNaMerenje',
            validate: rowData => rowData.datumNaZavrshuvanjeNaMerenje === undefined || rowData.datumNaZavrshuvanjeNaMerenje === "" ? "Required" : true,
          },
          {
            title: "Почетна состојба", field: 'pocetnaSostojba',
            validate: rowData => rowData.pocetnaSostojba === undefined || rowData.pocetnaSostojba === "" ? "Required" : true,
          },
          {
            title: "Крајна состојба", field: 'krajnaSostojba',
            validate: rowData => rowData.krajnaSostojba === undefined || rowData.krajnaSostojba === "" ? "Required" : true,
          },
          {
            title: "Количина", field: 'kolicina',
            validate: rowData => rowData.kolicina === undefined || rowData.kolicina === "" ? "Required" : true,
          },
          {
            title: "Мулти", field: 'multiplikator',
            validate: rowData => rowData.multiplikator === undefined || rowData.multiplikator === "" ? "Required" : true,
          },
          {
            title: "Вкупно количина", field: 'vkupnoKolicina',
            validate: rowData => rowData.vkupnoKolicina === undefined || rowData.vkupnoKolicina === "" ? "Required" : true,
          },

          {
            title: "Број мерно место", field: 'brojNaMernoMesto',
            validate: rowData => rowData.brojNaMernoMesto === undefined || rowData.brojNaMernoMesto === "" ? "Required" : true,
          },
          {
            title: "Број броило", field: 'brojNaBroilo',
            validate: rowData => rowData.brojNaBroilo === undefined || rowData.brojNaBroilo === "" ? "Required" : true,
          },
        
          {
            title: "Датум од ЕВН", field: 'datumNaIzrabotkaEVN',
            validate: rowData => rowData.datumNaIzrabotkaEVN === undefined || rowData.datumNaIzrabotkaEVN === "" ? "Required" : true,
          },

    ]
    
    
        return (
            <MaterialTable
              title="Кориснички сметки"
              columns={columns}
              data={props.dataa}
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
                    brojNaMernoMesto:newRow.brojNaMernoMesto,
                    brojNaBroilo:newRow.brojNaBroilo,
                    datumNaIzrabotkaEVN:newRow.datumNaIzrabotkaEVN,
                  },{withCredentials:true}).then(()=>{
                    props.getData()
                    resolve()
                  })
                  
                }),
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/storno/izbrisiStorno",{
                    id:selectedRow.id
                    
                  },{withCredentials:true}).then(()=>{
                    props.getData()
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
                    brojNaMernoMesto:updatedRow.brojNaMernoMesto,
                    brojNaBroilo:updatedRow.brojNaBroilo,
                    datumNaIzrabotkaEVN:updatedRow.datumNaIzrabotkaEVN
                  },{withCredentials:true}).then(()=>{
                    props.getData()
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

