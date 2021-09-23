import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from '@material-table/core';
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



export default function FirmiTable () {
    const [data, setData] = useState([])
    const [firmi, setFirmi] = useState([])
    const [nemaNeasocirani, setNemaAsocirani] = useState(false)
    useEffect(() => {
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      const reasociraj =()=>{
        axios.post("/storno/reasociraj",{},{withCredentials:true})
      }
      const proveriNeasocirani = () => {
        axios.post("/mernaTocka/najdiNeasocirani").then((res)=>{
          if(res.data.message==='true'){
            //EnableButton(1)
            setNemaAsocirani(false)
          }
          if(res.data.message==='false'){
            //EnableButton(0)
            setNemaAsocirani(true)
          }
        })
      }
      
      function getData(){
        reasociraj()
        proveriNeasocirani()
      }

    

    

    const columns = [
        { title: "Мерна точка ИД", field: "tockaID",
         filtering:false,
         defaultSort:"desc",
         },
         {
          title: "Цена ВТ", field: "cenaVT",
          validate: rowData => rowData.cenaVT === undefined || rowData.cenaVT === "" ? "Required" : true,
          filtering:false,
          type: "numeric"
        },
        {
          title: "Цена НТ", field: "cenaNT",
          validate: rowData => rowData.cenaNT === undefined || rowData.cenaNT === "" ? "Required" : true,
          filtering:false,
          type: "numeric"
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
                {nemaNeasocirani ? <Typography style={{color:"#00aa00"}} ><h1>Нема неасоцирани мерни точки </h1></Typography>:<Typography style={{color:"#ff0000"}}><h1>Има неасоцирани мерни точки</h1></Typography>}
            
            <MaterialTable
              title="Мерни точки"
              columns={columns}
              data={query=>new Promise((resolve,reject)=>{

                reasociraj()
                
                var firmiNiza = []
                var field = null
                var dir = null
                if(query.orderBy === undefined){
                  field="id"
                  dir="desc"
                }

                axios.post("/firmi/zemiFirmi",{
                  search: query.search, 
                 },{withCredentials:true}).then((firmi)=>{
                  firmi.data.rows.forEach((firma)=>{
                    firmiNiza[firma.id] = firma.name 
                    })
                      setFirmi(firmiNiza)
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
                   axios.post("/mernaTocka/getMerniTocki",{
                    search: query.search, 
                    pageSize:query.pageSize, 
                    page:query.page,
                    sortField:field,
                    orderDirection:dir
                   },{withCredentials:true}).then((response)=>{
                        reasociraj()
                        resolve({
                          data: response.data.rows,
                          page: query.page,
                          totalCount: response.data.count,
                      });
                    })
        
                })

              })}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                axios.post("/mernaTocka/dodadiMernaTocka",{
                  tockaID:newRow.tockaID,
                  cenaVT:newRow.cenaVT,
                  cenaNT:newRow.tarifaNT,
                  firmaID:newRow.firmaId,
                  adresa:newRow.adresa,
                  brojMestoPotrosuvacka:newRow.brojMestoPotrosuvacka
                },{withCredentials:true}).then(()=>{
                  getData()
                  resolve()
                })
                
              }),
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
                    cenaVT:updatedRow.cenaVT,
                    cenaNT:updatedRow.tarifaNT,
                    adresa:updatedRow.adresa,
                    brojMestoPotrosuvacka:updatedRow.brojMestoPotrosuvacka
                  },{withCredentials:true}).then(()=>{
                    axios.post("/storno/reasociraj")
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

