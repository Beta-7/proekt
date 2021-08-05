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


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    fontSize: "100px",
  },
  test:{
      fontSize: "100px",
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
  return ['Сензор дата', 'Агент на фирма', 'Мерна точка на фирма', "Дополнителни информации","Сторно", "Платени фактури", "Генерирање фактура"];
}



export default function HorizontalNonLinearStepperWithError() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [errors, setErrors] = React.useState([1,0,1,1,1,1,0]);
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
                <p>Прикачи го фајлот од елем во кој се запишани податоците за потрошувачите</p>
                <UploadSensorData step={0} stepState={errors} editStep={editStep}/></div>;
          case 1:
            return <div>
                <p></p>
                <FirmiTable/></div>;
          case 2:
            return <div>
                <p></p>
            <MerniTockiTable step={2} stepState={errors} editStep={editStep}/></div>;
          case 3:
            return <div>
                <p></p>
                <ZelenaEnergijaData step={3} stepState={errors} editStep={editStep}/></div>;
          case 4:
            return <div>
                <p></p>
                storno</div>;
          case 5:
            return <div>
                <p></p>
                provera na plakjanje</div>;
          case 6:
            return <div>
                <p></p>
                generiraj faktura</div>;
          default:
            return 'Unknown step';
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
  };

  return (
      <div className={classes.test}>
        
      <Stepper activeStep={activeStep}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {errorMessages}
              </Typography>
            );
            <StepLabel classes={{label: classes.customLabelStyle}}> // HERE add this
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
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              ResetsetActiveStep
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                  disabled={errors[activeStep]===1}
                >
                  Skip
                </Button>
              )}
                
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
          </div>
        )}
      </div>
    </div>
  );
}