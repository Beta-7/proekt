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




export default function FirmiTable (props) {
    const [data, setData] = useState([])
    const [firmi, setFirmi] = useState([])
    const [nemaNeasocirani, setNemaAsocirani] = useState(true)

    useEffect(() => {
      
      getData()
      }, [])


      const test = (asd) =>{
        console.log(props.stepState)
        props.editStep(props.step,asd)
      }
      
       function getData(){
        test(0) 
        var firmiNiza = []
         axios.post("/firmi/zemiFirmi",{},{withCredentials:true}).then((firmi)=>{
             firmi.data.rows.map((firma)=>{
                firmiNiza[firma.id] = firma.name 
                })
                
              setFirmi(firmiNiza)
           axios.post("/mernaTocka/getMerniTocki",{},{withCredentials:true}).then((response)=>{
                response.data.map((tocka)=>{
                    if(tocka.firmaId === null){
                      console.log("asd")
                      setNemaAsocirani(false)
                      test(1)
                      
                    }
                })  
            setData(response.data)
            })

        })

        
      }

    

    

    const columns = [
        { title: "Мерна точка ИД", field: "tockaID",
         filtering:false,
         defaultSort:"desc",
         editable: false
         },
        {
          title: "Цена", field: "cena",
          validate: rowData => rowData.cena === undefined || rowData.cena === "" ? "Required" : true,
          filtering:false,
          type: "numeric"
        },
        {
            title: "Тарифа", field: "tarifa",
            validate: rowData => rowData.tarifa === undefined || rowData.tarifa === "" ? "Required" : true,
            filtering:false,
            editable: false
          },
        {
          title: "Фирма", field: "firmaId",
          validate: rowData => rowData.firmaId === undefined || rowData.firmaId === "" ? "Required" : true,
          filtering:true,
          lookup: {...firmi}
        }]
    
    
        return (
            <div>
                {nemaNeasocirani ? <h1>Нема неасоцирани мерни точки</h1>:<h1>Има неасоцирани мерни точки</h1>}
            
            <MaterialTable
              title="Мерни точки"
              columns={columns}
              data={data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowDelete: selectedRow => new Promise((resolve, reject) => {
                  axios.post("/mernaTocka/izbrisiMernaTocka",{
                    id:selectedRow.id
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                  resolve()
                }),
                onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
                  axios.post("/mernaTocka/PromeniMernaTocka",{
                    id:oldRow.id,
                    firmaId:updatedRow.firmaId,
                    cena:updatedRow.cena
                  },{withCredentials:true}).then(()=>{
                    getData()
                    resolve()
                  })
                })
      
              }}
                options={{
                  actionsColumnIndex: -1, addRowPosition: "first",
                  filtering:true
                }}
            />
            </div>
    );
        



        
}
