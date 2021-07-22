import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));



export default function ZelenaEnergijaData() {
  const classes = useStyles();
  const [mesec, setMesec] = React.useState('');
  const [godina, setGodina] = React.useState('');
  const [vkupno, setVkupno] = React.useState('');
  const [cena, setCena] = React.useState('');

  const handleChange = (event) => {
    //   console.log(event.target)
    // setValue(event.target.value);
  };


  const onSubmitForm = (e) => {
    e.preventDefault();
    axios.post("/misc/AddZelenaData", {
        mesec,
        godina,
        vkupno,
        cena
    },{withCredentials: true}).then(()=>{

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
            }
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
            }
        }}
          type="number"
          onChange={(e)=>{setGodina(e.target.value)}}
        /><br/>
        <TextField
          id="vkupno"
          label="Vkupno kolicestvo zelena energija"
          placeholder="Vkupno kolicestvo zelena energija"
          variant="outlined"
          type="number"
          onChange={(e)=>{setVkupno(e.target.value)}}
        /><br/>
        <TextField
          id="cena"
          label="Cena"
          placeholder="Cena"
          variant="outlined"
          type="number"
          onChange={(e)=>{setCena(e.target.value)}}
        /><br/>
        <button variant="outlined" color="primary" type="submit">Submit</button>
      </div>
    </form>
    </center>
  );
}