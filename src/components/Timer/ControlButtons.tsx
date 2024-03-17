import React from "react";
import { Button } from "@mui/material";

interface ControlButtonsProps {
  active: boolean;
  isPaused: boolean;
  handleStart: () => void;
  handlePauseResume: () => void;
  handleStop: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  active,
  isPaused,
  handleStart,
  handlePauseResume,
  handleStop,
}) => {
  const StartButton = (
    <Button variant="contained" color="primary" onClick={handleStart}>
      Démarrer l'activité
    </Button>
  );

  const ActiveButtons = (
    <div>
      <Button variant="contained" color="error" onClick={handleStop}>
        Stop
      </Button>
      <Button variant="contained" color="success" onClick={handlePauseResume}>
        {isPaused ? "Reprendre" : "Pause"}
      </Button>
    </div>
  );

  return (
    <div className="Control-Buttons">
      <div>{active ? ActiveButtons : StartButton}</div>
    </div>
  );
};

export default ControlButtons;
