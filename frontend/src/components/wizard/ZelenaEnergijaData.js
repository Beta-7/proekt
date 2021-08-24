import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';



axios.defaults.baseURL = 'http://localhost:5000';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '60ch',
    },
  },
}));



export default function ZelenaEnergijaData(props) {
  const classes = useStyles();
  const [mesec, setMesec] = React.useState('');
  const [godina, setGodina] = React.useState('');
  const [vkupno, setVkupno] = React.useState('');
  const [cena, setCena] = React.useState('');
  const [kamata, setKamata] = React.useState('');
  const [organizacija, setOrganizacija] = React.useState('');
  const [DDVProcent, setDDVProcent] = React.useState('');
  

  const handleChange = (event) => {
    //   console.log(event.target)
    // setValue(event.target.value);
  };

  const test = (asd) =>{
    props.editStep(props.step,asd)
  }


  const onSubmitForm = (e) => {
    e.preventDefault();
    test(0)
    axios.post("/misc/AddZelenaData", {
        mesec,
        godina,
        vkupno,
        cena,
        kamata,
        organizacija,
        DDVProcent
    },{withCredentials: true}).then((res)=>{
      if(res.data.message==="success"){
        test(0)
      }else{
        test(1)
      }
    }).catch((err)=>{
        console.error(err)
    })

  }
  

  return (
    <center >
    <form className={classes.root} autoComplete="off" onSubmit={onSubmitForm}>
      <div>
        <TextField
          id="mesec"
          type="number"
          label="Mesec"
          InputProps={{
            inputProps: { 
                max: 12, min: 1 
            },
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
          placeholder="Mesec"
          variant="outlined"
          onChange={(e)=>{
            if(e.target.value<10){
                setMesec("0"+e.target.value)
            }else
            setMesec(e.target.value)
            }}
        /><br/>
        <TextField
          id="godina"
          label="Godina"
          placeholder="Godina"
          variant="outlined"
          InputProps={{
            inputProps: { 
                max: 2100, min: 2020 
            },
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
          type="number"
          onChange={(e)=>{setGodina(e.target.value)}}
        /><br/>
        <TextField
          id="Vkupno"
          label="Vkupno kolicestvo zelena energija"
          placeholder="Vkupno kolicestvo zelena energija"
          variant="outlined"
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
          type="number"
          onChange={(e)=>{setVkupno(e.target.value)}}
        /><br/>
        <TextField
          id="cena"
          label="Cena"
          placeholder="Cena"
          variant="outlined"
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
          type="number"
          onChange={(e)=>{setCena(e.target.value)}}
          
        /><br/>
        <TextField
          id="kamata"
          label="Kamatna stapka za kasnenje"
          placeholder="Kamata"
          variant="outlined"
          type="number"
          onChange={(e)=>{setKamata(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        /><br/>
        <TextField
          id="organizacija"
          label="Nadomest za organizacija"
          placeholder="Nadomest"
          variant="outlined"
          type="number"
          onChange={(e)=>{setOrganizacija(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        /><br/>
        <TextField
          id="DDV"
          label="DDV Procent"
          placeholder="DDVProcent"  
          variant="outlined"
          type="number"
          onChange={(e)=>{setDDVProcent(e.target.value)}}
          InputProps={{
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
        /><br/>
        <button variant="outlined" color="primary" type="submit"  style={{fontSize:"15px"}}>Submit</button>
      </div>
    </form>
    </center>
  );
}