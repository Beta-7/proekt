import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UploadSensorData from './UploadSensorData';
import MerniTockiTable from './MerniTockiTable';
import FirmiTable from './FirmiTable';
import ZelenaEnergijaData from './ZelenaEnergijaData';
import UploadStornoData from './UploadStornoData';
import FakturiTable from './FakturiTable';
import GenerirajFakturi from './GenerirajFakturi'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      body2: {
        fontSize: [16, "!important"]
      }
    }
  }
});


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));



function getSteps() {
  return ['Сензор дата',"Сторно", 'Агент на фирма', 'Мерна точка на фирма', "Дополнителни информации", "Платени фактури", "Генерирање фактура"];
}



export default function HorizontalNonLinearStepperWithError() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(7);
  const [skipped, setSkipped] = React.useState(new Set());
  const [errors, setErrors] = React.useState([1,0,0,1,1,0,0]);
  const steps = getSteps();
  var errorMessages="Незавршен чекор"  
  
  useEffect(()=>{
    
  })
    const editStep = (step,state)=>{
        var newErrors = [...errors]
        newErrors[step]=state
        setErrors(newErrors)
        console.log(errors)
    }
    function getStepContent(step) {
        
        switch (step) {
          case 0:
            return <div>
              <Typography variant="h4" >
                <p>Прикачи го фајлот од елем во кој се запишани податоците за потрошувачите</p>
                </Typography>
                <Typography variant="h5" >
                <UploadSensorData step={0} stepState={errors} editStep={editStep}/>
                </Typography>
                </div>;
          case 1:
            return <div>
                <Typography variant="h4" >
                <p>Прикачи го фајлот од елем во кој се запишани сторно податоците</p>
                </Typography>
                <Typography variant="h5" >
                <UploadStornoData/>
                </Typography>
                </div>;
          case 2:
            return <div>
                <Typography variant="h5" >
                <FirmiTable/>
                </Typography></div>;
          case 3:
            return <div>
                <Typography variant="h5">
                <MerniTockiTable step={3} stepState={errors} editStep={editStep}/>
                </Typography>
                </div>;
          case 4:
            return <div>
                <ZelenaEnergijaData step={4} stepState={errors} editStep={editStep}/>
                </div>;
          
          case 5:
            return <div>
                <Typography variant="h5">
                <FakturiTable/>
                </Typography>
                </div>;
          case 6:
            return <div>
                <Typography variant="h3">
                <GenerirajFakturi/>
                </Typography>
                </div>;
          default:
            return 'Крај';
        }
      }
  const isStepOptional = (step) => {
    return errors[step]===1;
  };

  const isStepFailed = (step) => {
    return errors[step]===1
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(skipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setErrors([1,0,0,1,1,0,0])
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.test}>

      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions} variant="h3">
              Чекорите се завршени, дали сакате да внесете нови податоци?
            </Typography>
            <Button onClick={handleReset}  variant="contained" className={classes.button} style={{fontSize:"15px"}}>
              Повторно
            </Button>
          </div>
        ) : (
          <div>
            
            <div>
              <div className="nav navbar-nav navbar-left" style={{"margin-left": "10px"}}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              </div>
                <div className="nav navbar-nav navbar-right" style={{"margin-right": "10px"}}>
                <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={errors[activeStep]===1}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
               </div>
               <br></br><br></br>
               
            </div>
          </div>
        )}
      </div>
        
      <Stepper activeStep={activeStep}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="h6" color="error">
                {errorMessages}
              </Typography>
            );
            <StepLabel classes={{label: classes.customLabelStyle}}>
      {label}
    </StepLabel>
          }
          if (isStepFailed(index)) {
            labelProps.error = true;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      
      <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
    </div>
    </ThemeProvider>
  );
}