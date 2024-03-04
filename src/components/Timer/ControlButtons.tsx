import React from 'react';
import { Button } from '@mui/material';
import { useTime } from '../../context/TimeContext'; // Adjust the import path as necessary

const ControlButtons: React.FC = () => {
  const { isActive, isPaused, start, pauseResume, reset } = useTime();

  const StartButton = (
    <Button variant="contained" color="primary" onClick={start}>
      Démarrer l'activité
    </Button>
  );

  const ActiveButtons = (
    <div>
      <Button variant="contained" color="error" onClick={reset}>
        Stop
      </Button>
      <Button variant="contained" color="success" onClick={pauseResume}>
        {isPaused ? "Play" : "Pause"}
      </Button>
    </div>
  );

  return (
    <div className="Control-Buttons">
      <div>{isActive ? ActiveButtons : StartButton}</div>
    </div>
  );
};

export default ControlButtons;
