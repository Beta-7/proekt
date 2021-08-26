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
  const [mesecError, setMesecError] = React.useState(false);
  const [godinaError, setGodinaError] = React.useState(false);
  const [vkupnoError, setVkupnoError] = React.useState(false);
  const [cenaError, setCenaError] = React.useState(false);
  const [kamataError, setKamataError] = React.useState(false);
  const [organizacijaError, setOrganizacijaError] = React.useState(false);
  const [DDVProcentError, setDDVProcentError] = React.useState(false);
  

  const handleChange = (event) => {
    //   console.log(event.target)
    // setValue(event.target.value);
  };

  const test = (asd) =>{
    props.editStep(props.step,asd)
  }


  const onSubmitForm = (e) => {
    e.preventDefault();
    var failed = false
    if(mesec === ''){
      setMesecError(true)
      failed = true
    }

    if(godina === ''){
      setGodinaError(true)
      failed = true
    }

    if(vkupno === ''){
      setVkupnoError(true)
      failed = true
    }

    if(cena === ''){
      setCenaError(true)
      failed = true
    }

    if(kamata === ''){
      setKamataError(true)
      failed = true
    }

    if(organizacija === ''){
      setOrganizacijaError(true)
      failed = true
    }

    if(DDVProcent === ''){
      setDDVProcentError(true)
      failed = true
    }

    if(failed === true){
      return
    }

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
          error={mesecError}
          oninput="setCustomValidity('')"
          id="mesec"
          type="number"
          label="Месец*"
          InputProps={{
            inputProps: { 
                max: 12, min: 1 
            },
            style: {fontSize: 15}
          }}
          InputLabelProps={{
            style: {fontSize: 15}
          }}
          placeholder="Месец*"
          variant="outlined"
          onChange={(e)=>{
            if(e.target.value<10){
                setMesec("0"+e.target.value)
            }else
            setMesec(e.target.value)
            }}
        /><br/>
        <TextField
          error={godinaError}
          id="godina"
          label="Година*"
          placeholder="Година*"
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
          error={vkupnoError}
          id="Vkupno"
          label="Вкупно количество зелена енергија*"
          placeholder="Вкупно количество зелена енергија*"
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
          error={cenaError}
          id="cena"
          label="Цена*"
          placeholder="Цена*"
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
          error={kamataError}
          id="kamata"
          label="Каматна стапка за каснење*"
          placeholder="Каматна стапка за каснење*"
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
          error={organizacijaError}
          id="organizacija"
          label="Надомест за организација*"
          placeholder="Надомест за организација*"
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
          error={DDVProcentError}
          id="DDV"
          label="ДДВ Процент*"
          placeholder="ДДВ Процент*"  
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