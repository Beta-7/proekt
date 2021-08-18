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




export default function FakturaTable(props) {
    const [data, setData] = useState([])


    useEffect(() => {
      console.log(props.data)
      setData(props.data)
      console.log(data)
      getData()
      }, [])



      
       function getData(){
          axios.post("/faktura/getFakturi",{},{withCredentials:true}).then((response)=>{
              setData(response.data)
          })
        }

    

    

    const columns = [
        { title: "id", field: "id",
         hidden:true,
         defaultSort:"desc"
         },
        {
          title: "arhivskiBroj", field: "arhivskiBroj",
          validate: rowData => rowData.arhivskiBroj === undefined || rowData.arhivskiBroj === "" ? "Required" : true,
          editable: false
        },
        {
          title: "mesec", field: "mesec",
          validate: rowData => rowData.mesec === undefined || rowData.mesec === "" ? "Required" : true, 
          editable: false
        },
        {
          title: "godina", field: 'godina',
          validate: rowData => rowData.godina === undefined || rowData.godina === "" ? "Required" : true,
          editable: false
        },
        {
            title: "platena", field: 'platena',
            validate: rowData => rowData.platena === undefined || rowData.platena === "" ? "Required" : true,
            type: 'boolean'
          },
          {
            title: "platenaNaDatum", field: 'platenaNaDatum',
            validate: rowData => rowData.platenaNaDatum === undefined || rowData.platenaNaDatum === "" ? "Required" : true,
            type: 'date'
          },
          {
            title: "rokZaNaplata", field: 'rokZaNaplata',
            validate: rowData => rowData.rokZaNaplata === undefined || rowData.rokZaNaplata === "" ? "Required" : true,
            editable: false
          },
          {
            title: "kamataOdPrethodniFakturi", field: 'kamataOdPrethodniFakturi',
            validate: rowData => rowData.kamataOdPrethodniFakturi === undefined || rowData.kamataOdPrethodniFakturi === "" ? "Required" : true,
            editable: false
          },
          {
            title: "datumNaIzdavanje", field: 'datumNaIzdavanje',
            validate: rowData => rowData.datumNaIzdavanje === undefined || rowData.datumNaIzdavanje === "" ? "Required" : true,
            editable: false
          },
          {
            title: "kamataZaKasnenje", field: 'kamataZaKasnenje',
            validate: rowData => rowData.kamataZaKasnenje === undefined || rowData.kamataZaKasnenje === "" ? "Required" : true,
            editable: false
          },
          {
            title: "dataOd", field: 'dataOd',
            validate: rowData => rowData.dataOd === undefined || rowData.dataOd === "" ? "Required" : true,
            editable: false
          },
          {
            title: "dataDo", field: 'dataDo',
            validate: rowData => rowData.dataDo === undefined || rowData.dataDo === "" ? "Required" : true,
            editable: false
          },
          {
            title: "elektricnaEnergija", field: 'elektricnaEnergija',
            validate: rowData => rowData.elektricnaEnergija === undefined || rowData.elektricnaEnergija === "" ? "Required" : true,
            editable: false
          },
          {
            title: "elektricnaEnergijaBezZelena", field: 'elektricnaEnergijaBezZelena',
            validate: rowData => rowData.elektricnaEnergijaBezZelena === undefined || rowData.elektricnaEnergijaBezZelena === "" ? "Required" : true,
            editable: false
          },
          {
            title: "cenaKwhBezDDV", field: 'cenaKwhBezDDV',
            validate: rowData => rowData.cenaKwhBezDDV === undefined || rowData.cenaKwhBezDDV === "" ? "Required" : true,
            editable: false
          },
          {
            title: "vkupenIznosBezDDV", field: 'vkupenIznosBezDDV',
            validate: rowData => rowData.vkupenIznosBezDDV === undefined || rowData.vkupenIznosBezDDV === "" ? "Required" : true,
            editable: false
          },
          {
            title: "obnovlivaEnergija", field: 'obnovlivaEnergija',
            validate: rowData => rowData.obnovlivaEnergija === undefined || rowData.obnovlivaEnergija === "" ? "Required" : true,
            editable: false
          },
          {
            title: "cenaObnovlivaEnergija", field: 'cenaObnovlivaEnergija',
            validate: rowData => rowData.cenaObnovlivaEnergija === undefined || rowData.cenaObnovlivaEnergija === "" ? "Required" : true,
            editable: false
          },
          {
            title: "vkupnaObnovlivaEnergijaBezDDV", field: 'vkupnaObnovlivaEnergijaBezDDV',
            validate: rowData => rowData.vkupnaObnovlivaEnergijaBezDDV === undefined || rowData.vkupnaObnovlivaEnergijaBezDDV === "" ? "Required" : true,
            editable: false
          },
          {
            title: "nadomestZaOrganizacija", field: 'nadomestZaOrganizacija',
            validate: rowData => rowData.nadomestZaOrganizacija === undefined || rowData.nadomestZaOrganizacija === "" ? "Required" : true,
            editable: false
          },
          {
            title: "nadomestZaOrganizacijaOdKwh", field: 'nadomestZaOrganizacijaOdKwh',
            validate: rowData => rowData.nadomestZaOrganizacijaOdKwh === undefined || rowData.nadomestZaOrganizacijaOdKwh === "" ? "Required" : true,
            editable: false
          },
          {
            title: "vkupenIznosNaFakturaBezDDV", field: 'vkupenIznosNaFakturaBezDDV',
            validate: rowData => rowData.vkupenIznosNaFakturaBezDDV === undefined || rowData.vkupenIznosNaFakturaBezDDV === "" ? "Required" : true,
            editable: false
          },
          {
            title: "DDV", field: 'DDV',
            validate: rowData => rowData.DDV === undefined || rowData.DDV === "" ? "Required" : true,
            editable: false
          },
          {
            title: "vkupnaNaplata", field: 'vkupnaNaplata',
            validate: rowData => rowData.vkupnaNaplata === undefined || rowData.vkupnaNaplata === "" ? "Required" : true,
            editable: false
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
                  actionsColumnIndex: -1, addRowPosition: "first",
                  headerStyle: {
                    fontSize: 13,
                  }
                }}
            />
    );
        



        
}

