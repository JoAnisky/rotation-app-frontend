import React from "react";
import PagesContainer from "../layouts/PageContainer";
import Status from "../components/Status";
import { Box } from "@mui/material";
import StopWatch from "../components/Timer/Stopwatch";

interface StatusProps {
  role: string;
  isAdmin: boolean;
}

const Stand: React.FC<StatusProps> = ({ role, isAdmin }) => {
  return (
    <PagesContainer role={role}>
      <Status />
      <Box className="timer-container">
        <div>
          <p>Equipe NOM</p>
          <p>Stand NOM</p>
        </div>
        <StopWatch isAdmin={isAdmin} />
      </Box>

      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Stand;
