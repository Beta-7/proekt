import MUIDataTable from "mui-datatables";
import React, {forwardRef, useState, useEffect} from 'react';
import axios from 'axios';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";


axios.defaults.baseURL = 'http://localhost:5000';




export default function Table () {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0)
    const [responsive, setResponsive] = useState("vertical");
    const [tableBodyHeight, setTableBodyHeight] = useState("400px");
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");

    const columns = ["id", "name", "broj", "agent"];

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive,
      tableBodyHeight,
      tableBodyMaxHeight,
      rowsPerPageOptions: [5,15,100],
      rowsPerPage: 5
    };

    useEffect(() => {
        getKompanii(0, 50)
      }, [])
    const getKompanii=()=>{
        const offset = (page - 1) * itemsPerPage
        axios.post("/firmi/zemiFirmi",{limit:50, offset:offset},{withCredentials:true}).then((response)=>{
            setData(response.data.rows)
            console.log(response.data.rows);
        })
    }
    
    
        return (
          <React.Fragment>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Responsive Option</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={responsive}
          style={{ width: "200px", marginBottom: "10px", marginRight: 10 }}
          onChange={(e) => setResponsive(e.target.value)}
        >
          <MenuItem value={"vertical"}>vertical</MenuItem>
          <MenuItem value={"standard"}>standard</MenuItem>
          <MenuItem value={"simple"}>simple</MenuItem>

          <MenuItem value={"scroll"}>scroll (deprecated)</MenuItem>
          <MenuItem value={"scrollMaxHeight"}>
            scrollMaxHeight (deprecated)
          </MenuItem>
          <MenuItem value={"stacked"}>stacked (deprecated)</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Table Body Height</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tableBodyHeight}
          style={{ width: "200px", marginBottom: "10px", marginRight: 10 }}
          onChange={(e) => setTableBodyHeight(e.target.value)}
        >
          <MenuItem value={""}>[blank]</MenuItem>
          <MenuItem value={"400px"}>400px</MenuItem>
          <MenuItem value={"800px"}>800px</MenuItem>
          <MenuItem value={"100%"}>100%</MenuItem>
        </Select>
      </FormControl>
      <MUIDataTable
        title={"Table"}
        data={data}
        columns={columns}
        options={options}
      />
    </React.Fragment>
    );
        



        
}

