import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";

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



export default function FirmiTable (props) {
    const [data, setData] = useState([])
    const [firmi, setFirmi] = useState([])
    const [nemaNeasocirani, setNemaAsocirani] = useState(false)

    useEffect(() => {
      proveriNeasocirani()
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      const reasociraj =()=>{
        axios.post("/storno/reasociraj",{},{withCredentials:true})
        proveriNeasocirani()
      }

      const proveriNeasocirani = () => {
        axios.post("/mernaTocka/najdiNeasocirani").then((res)=>{
          if(res.data.message==='true'){
            EnableButton(1)
            setNemaAsocirani(false)
          }
          if(res.data.message==='false'){
            EnableButton(0)
            setNemaAsocirani(true)
          }
        })
      }

      const EnableButton = (asd) =>{
        props.editStep(props.step,asd)
      }
      
       function getData(){
        reasociraj()
        EnableButton(1) 
        
        var firmiNiza = []
         axios.post("/firmi/zemiFirmi",{},{withCredentials:true}).then((firmi)=>{
             firmi.data.rows.forEach((firma)=>{
                firmiNiza[firma.id] = firma.name 
                })
                
              setFirmi(firmiNiza)
           axios.post("/mernaTocka/getMerniTocki",{},{withCredentials:true}).then((response)=>{
            
                response.data.forEach((tocka)=>{
                  
                    if(tocka.firmaId === null){
                      
                      
                      
                    }
                })
                reasociraj()
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
        },
        {
          title: "Адреса на мерна точка", field: "adresa",
          validate: rowData => rowData.adresa === undefined || rowData.adresa === "" ? "Required" : true,
          filtering:true,
        },
        {
          title: "Број на место на потрошувачка", field: "brojMestoPotrosuvacka",
          validate: rowData => rowData.brojMestoPotrosuvacka === undefined || rowData.brojMestoPotrosuvacka === "" ? "Required" : true,
          filtering:true,
        }
      ]
    
    
        return (
            <div>
                {nemaNeasocirani ? <Typography style={{color:"#00aa00"}} ><h1>Нема неасоцирани мерни точки</h1></Typography>:<Typography style={{color:"#ff0000"}}><h1>Има неасоцирани мерни точки</h1></Typography>}
            
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
                    cena:updatedRow.cena,
                    adresa:updatedRow.adresa,
                    brojMestoPotrosuvacka:updatedRow.brojMestoPotrosuvacka
                  },{withCredentials:true}).then(()=>{
                    reasociraj()
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
            </div>
    );
        



        
}

