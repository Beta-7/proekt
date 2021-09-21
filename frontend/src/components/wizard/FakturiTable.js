import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GetAppIcon from '@material-ui/icons/GetApp';
import MaterialTable from '@material-table/core';
import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import TextField from '@material-ui/core/TextField';
import { TablePagination } from '@material-ui/core';




axios.defaults.baseUrl = 'http://localhost:5000';



export default function FakturaTable(props) {
    const [data, setData] = useState([])
    const [godina, setGodina] = useState("")
    const [mesec, setMesec] = useState("")

    useEffect(() => {
      getData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      function hangleClick(){
        new Promise((resolve,reject) => {
          axios.get('/faktura/zemiFakturiMesec', {
            responseType: 'blob',
            params: {
              mesec,
              godina
            }
          },{withCredentials:true}).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = response.headers['content-disposition'].split('filename=')[1];
            link.setAttribute('download', filename.substring(1).slice(0,-1));
            document.body.appendChild(link);
            link.click();
          });
        })
      }
      
       function getData(){
          // axios.post("/faktura/getFakturi",{},{withCredentials:true}).then((response)=>{
          //   response.data.forEach((row)=>{
          //     row.datumNaIzdavanje=row.datumNaIzdavanje.replace("-",".").replace("-",".")
          //     row.rokZaNaplata=row.rokZaNaplata.replace("-",".").replace("-",".")
          //   })  
          //   setData(response.data)
          // })
        }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc",
         editable:false
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
          <div>
            <TextField
          id="mesec"
          label="Месец"
          placeholder="Месец"
          value={mesec}
          size="small"
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
          size="small"
          variant="outlined"
          type="Number"
          onChange={(e)=>{setGodina(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        />
                <IconButton onClick={hangleClick} style={{marginTop: "-12px", marginLeft: "10px"}} variant="contained">
                    <SystemUpdateAltIcon style={{height: "40px", width: "40px"}} fontSize="large"/>
                </IconButton>

                <br></br>
        <br></br> 
            <MaterialTable
              title="Кориснички сметки"
              columns={columns}
              data={query =>
                new Promise((resolve, reject) => {
                  console.log(query.orderBy.field, query.orderDirection)
                  axios.post("/faktura/getFakturi",{search: query.search, pageSize:query.pageSize, page:query.page, sortField:query.orderBy.field, orderDirection:query.orderDirection},{withCredentials:true}).then((response)=>{
                    response.data.rows.forEach((row)=>{
                      row.datumNaIzdavanje=row.datumNaIzdavanje.replace("-",".").replace("-",".")
                      row.rokZaNaplata=row.rokZaNaplata.replace("-",".").replace("-",".")
                    })  
                    resolve({
                      data: response.data.rows,
                      page: query.page,
                      totalCount: response.data.count,
                  });
                  })
                    
                })
            }
              paginationMode="server"
              components={{

              }}
              actions={[
                {
                  icon: () => <GetAppIcon/>,
                  tooltip: 'Edit User',
                  onClick: (event, rowData) => new Promise((resolve,reject) => {
                    axios.get('/faktura/ZemiFaktura', {
                      responseType: 'blob',
                      params: {
                        fakturaid:rowData.id,
                        izbor:"excel"
                      }
                    },{withCredentials:true}).then((response) => {
                      console.log(response)
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      const filename = response.headers['content-disposition'].split('filename=')[1];
                      console.log(filename)
                      link.setAttribute('download', filename.substring(1).slice(0,-1));
                      document.body.appendChild(link);
                      link.click();
                    });
                  })
                },
              ]}
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
                  pageSize:20,     // make initial page size
                  emptyRowsWhenPaging: true,   //to make page size fix in case of less data rows
                  pageSizeOptions:[5,10,20],
                  actionsColumnIndex: -1, addRowPosition: "first",
                  headerStyle: {
                    fontSize: 13,
                  },
                }}
                
            />

            </div>
    );
        



        
}

