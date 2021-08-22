import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import FakturiTable from './FakturiTable';
import MaterialTable, { MaterialTableProps } from 'material-table';
import { TablePagination, TablePaginationProps } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
  


const theme = createTheme({
    palette: {
      secondary: {
        main: '#d9534f',
      },
    },
  });



axios.defaults.baseURL = 'http://localhost:5000';

    


export default function FakturaTable(props) {
    const [mesec, setMesec] = React.useState('');
    const [godina, setGodina] = React.useState('');
    const [data, setData] = useState([])

    useEffect(()=>{
        
        setMesec(new Date().getMonth()+1)
        setGodina( new Date().getFullYear())
    },[])
    
    const getData=()=>{
            console.log("asd")
            axios.post("/faktura/getFakturi",{
                mesec,
                godina
            },{withCredentials:true}).then((response)=>{
             setData(response.data)
            })
          }

          const generiraj = ()=>{
            axios.post("/faktura/generirajFakturi",{
                mesec,
                godina
            },{withCredentials:true}).then(()=>{
                axios.post("/faktura/dodeliNagradi",{
                    mesec,
                    godina
                    },{withCredentials:true}).then(()=>{
                    console.log("asdasd ")
                    getData()
                })
            })
        }

        const columns = [
            { title: "id", field: "id",
             hidden:true,
             defaultSort:"desc"
             },
            {
              title: "Архивски Број", field: "arhivskiBroj",
              validate: rowData => rowData.arhivskiBroj === undefined || rowData.arhivskiBroj === "" ? "Required" : true,
              editable: false
            },
            {
              title: "Месец", field: "mesec",
              validate: rowData => rowData.mesec === undefined || rowData.mesec === "" ? "Required" : true, 
              editable: false
            },
            {
              title: "Година", field: 'godina',
              validate: rowData => rowData.godina === undefined || rowData.godina === "" ? "Required" : true,
              editable: false
            },
            {
                title: "Платена", field: 'platena',
                validate: rowData => rowData.platena === undefined || rowData.platena === "" ? "Required" : true,
                type: 'boolean'
              },
              {
                title: "Датум на издавање", field: 'datumNaIzdavanje',
                validate: rowData => rowData.datumNaIzdavanje === undefined || rowData.datumNaIzdavanje === "" ? "Required" : true,
                editable: false
              },
              {
                title: "Датум на плаќање", field: 'platenaNaDatum',
                validate: rowData => rowData.platenaNaDatum === undefined || rowData.platenaNaDatum === "" ? "Required" : true,
                type: 'date'
              },
              {
                title: "Рок за наплата", field: 'rokZaNaplata',
                validate: rowData => rowData.rokZaNaplata === undefined || rowData.rokZaNaplata === "" ? "Required" : true,
                editable: false
              },
              {
                title: "Вкупен износ", field: 'vkupnaNaplata',
                validate: rowData => rowData.vkupnaNaplata === undefined || rowData.vkupnaNaplata === "" ? "Required" : true,
                editable: false
              },
        ]
        return (
            <MuiThemeProvider theme={theme}>
            <div>
                <center>
                <TextField
          id="mesec"
          label="Месец"
          placeholder="Месец"
          value={mesec}
          variant="outlined"
          type="number"
          onChange={(e)=>{setMesec(e.target.value)}}
          InputProps={{
            style: {fontSize: 15},
            inputProps: { min: 0, max: new Date().getMonth()+1 }
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        />
                <TextField
          id="godina"
          label="Година"
          placeholder="Година"
          value={godina}  
          variant="outlined"
          type="number"
          onChange={(e)=>{setGodina(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        />
        <br></br>
        <br></br>
                <Button onClick={generiraj} style={{fontSize:"15px"}} variant="contained" color="secondary">
                    Генерирај фактури
                </Button>
                
                <MaterialTable
              title="Кориснички сметки"
              columns={columns}
              data={data}
              components={{
                Pagination: PatchedPagination,
              }}
              editable={{
                onRowUpdate: (updatedRow,oldRow) => new Promise((resolve,reject) => {
                  axios.post("/faktura/platiFaktura",{
                    id:oldRow.id,
                    platenaNaDatum:updatedRow.platenaNaDatum,
                    platena:updatedRow.platena
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
                </center>
            </div>
            </MuiThemeProvider>
    );
        



        
}

