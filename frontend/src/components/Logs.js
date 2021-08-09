import React, {useState, useEffect} from 'react';
import axios from 'axios';

import MaterialTable, { MaterialTableProps } from 'material-table';
import { TablePagination, TablePaginationProps } from '@material-ui/core';

import { makeStyles } from "@material-ui/core";



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


    useEffect(() => {
      getData()
      }, [])



      
       function getData(){

          axios.post("/misc/GetLogs",{},{withCredentials:true}).then((response)=>{
                setData(response.data.rows)
              
          })



        }

    

    

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
              data={data}
              components={{
                Pagination: PatchedPagination,
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
