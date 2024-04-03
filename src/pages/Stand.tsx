import React from "react";
import PagesContainer from "../layouts/PageContainer";
import Status from "../components/Status";
import { Box } from "@mui/material";
import StopWatch from "../components/Timer/Stopwatch";

interface StatusProps {
  role: string;
  isAdmin: boolean;
  standName: string | undefined;
}

const Stand: React.FC<StatusProps> = ({ role, isAdmin, standName }) => {
  return (
    <PagesContainer role={role}>
      <Status />
        <h2>{standName}</h2>
      <Box className="timer-container">
        <div>
          <p>Equipe NOM</p>
        </div>
        <StopWatch isAdmin={isAdmin} />
      </Box>

      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Stand;
