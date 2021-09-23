import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable from '@material-table/core';
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



export default function broilosTable () {
    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "Број на мерна точка", field: "brojMernaTocka",
          validate: rowData => rowData.username === undefined || rowData.username === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Месец", field: "mesec",
          validate: rowData => rowData.ime === undefined || rowData.ime === "" ? "Required" : true,
          filtering:false
        },
        {
          title: "Тарифа", field: 'tarifa',
          validate: rowData => rowData.prezime === undefined || rowData.prezime === "" ? "Required" : true,
        },
        {
          title: "Датум почеток", field: 'datumPocetok',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Датум крај", field: 'datumKraj',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Почетна состојба", field: 'pocetnaSostojba',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Крајна состојба", field: 'krajnaSostojba',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Количина", field: 'kolicina',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Мултипликатор", field: 'multiplikator',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Вкупна количина", field: 'vkupnoKolicina',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "nebitno", field: 'nebitno',
          hidden:true,
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Број на мерно место", field: 'brojMernoMesto',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Број на броило", field: 'brojBroilo',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "prazno", field: 'prazno',
          hidden:true,
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        },
        {
          title: "Датум од евн", field: 'datumOdEvn',
          validate: rowData => rowData.isAdmin === undefined || rowData.isAdmin === "" ? "Required" : true,
        }
    ]
    
    
        return (
            <MaterialTable
              title="Броила"
              columns={columns}
              data={query=>new Promise((resolve,reject)=>{
                var field = null
                  var dir = null
                  if(query.orderBy === undefined){
                    field="id"
                    dir="desc"
                  }
                  else{
                    field = query.orderBy.field
                    dir = query.orderDirection
                  }
                axios.post("/broilo/getBroilos",{
                  search: query.search, 
                  pageSize:query.pageSize, 
                  page:query.page,
                  sortField:field,
                  orderDirection:dir
                }).then(response=>{
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

