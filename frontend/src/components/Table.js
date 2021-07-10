
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

axios.defaults.baseURL = 'http://localhost:5000';

export default function Table () {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0)
    useEffect(() => {
        getKompanii(0, 50)
      }, [])
    const getKompanii=()=>{
        const offset = (page - 1) * itemsPerPage
        axios.post("/firmi/zemiFirmi",{limit:50, offset:offset},{withCredentials:true}).then((response)=>{
            setData(response.data.rows)
        
        })
    }

    const columns = [
        { title: "id", field: "id", validate: rowData => rowData.id === undefined || rowData.id === "" ? "Required" : true },
        {
          title: "Ime", field: "name",
          validate: rowData => rowData.name === undefined || rowData.name === "" ? "Required" : true
        },
        {
          title: "Broj", field: "broj",
          validate: rowData => rowData.broj === undefined || rowData.broj === "" ? "Required" : true
        },
        {
          title: "Agent", field: 'agent',
          validate: rowData => rowData.agent === undefined || rowData.agent === "" ? "Required" : true
        }]
    
    
        return (
            <MaterialTable
              title="Student Details"
              columns={columns}
              data={data}
              onChangePage={(newPage) => {
                    setPage(newPage)
                    console.log(newPage)
              }}
              onChangeRowsPerPage={(newRowsPerPage) => {
                setItemsPerPage(newRowsPerPage)
                console.log(newRowsPerPage)
              }}
      
      
            />
    );
        



        
}

