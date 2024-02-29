import { Button } from '@mui/material';
import React from 'react';

interface ControlButtonsProps {
  handleStart: () => void;
  handleReset: () => void;
  handlePauseResume: () => void;
  isPaused: boolean;
  active: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = (props) => {
  const StartButton = (
    <Button variant="contained" color="primary" onClick={props.handleStart}>
      Démarrer
    </Button>
  );

  const ActiveButtons = (
    <div>
      <Button variant="contained" color="error" onClick={props.handleReset}>
        Stop
      </Button>
      <Button variant="contained" color="success" onClick={props.handlePauseResume}>
        {props.isPaused ? "Play" : "Pause"}
      </Button>
    </div>
  );

  return (
    <div className="Control-Buttons">
      <div>{props.active ? ActiveButtons : StartButton}</div>
    </div>
  );
};

export default ControlButtons;
