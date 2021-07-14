import axios from 'axios';
 
import React,{Component} from 'react';
 
class UploadSensorData extends Component {
  
    state = {
      selectedFile: null
    };
    onFileChange = event => {
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    
    onFileUpload = () => {
      const formData = new FormData();
      if(this.state.selectedFile!==null){
      formData.append(
        "sensorData",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      axios.post("/broilo/uploadfile", formData);
      }
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
              Прикачи документ (сензор дата)<br/><br/>
            </h1>
            <div>
                <input type="file" name="sensorData" onChange={this.onFileChange} /><br/>
                <button onClick={this.onFileUpload}>
                  Прикачи!
                </button>
            </div>
          {this.fileData()}
          </center>
        </div>
      );
    }
  }
 
  export default UploadSensorData;