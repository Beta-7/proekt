import axios from 'axios';
 
import React,{Component} from 'react';
import StornoTable from './StornoTable'


class UploadStornoData extends Component {
    constructor(props){
      super(props)
      this.handleChange = this.handleChange.bind(this);
      this.data = null
    }
    state = {
      selectedFile: null,
    };

    getData(){
       axios.post("/storno/getStornos",{},{withCredentials:true}).then((response)=>{
        this.data(response.data)
       })
     }

    onFileChange = event => {
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    test = () =>{
      //this.props.editStep(0,0)
    }
     handleChange = (prvo, vtoro)=>{
      this.props.editStep(prvo,vtoro)
    }
    onFileUpload = () => {
      const formData = new FormData();
      if(this.state.selectedFile!==null){
      formData.append(
        "stornoData",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      axios.post("/storno/uploadStornoFile", formData,{withCredentials:true}).then((res)=>{
        if(res.data.message==="success"){
          this.test()
        }
      });
      }
      console.log(this.state.data)

    };
    
    fileData = () => {
    
      if (this.state.selectedFile) {
         
       
      } else {
        return (
          <div>
            <br />
            <h4>Изберете документ пред да прикачите</h4>
          
          </div>
        );
      }
    };
    
    render() {
    
      return (
        <div>
          
          <center>
            <h1> 
              Прикачи документ (Сторно дата)<br/><br/>

            </h1>
            <div>
                <input type="file" name="stornoData" accept=".csv" onChange={this.onFileChange} /><br/>
                <button onClick={this.onFileUpload}>
                  Прикачи!
                </button>
            </div>
          {this.fileData()}
          </center>
          <StornoTable data={this.state.data}></StornoTable>
        </div>
      );
    }
  }
 
  export default UploadStornoData;