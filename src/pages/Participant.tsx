import React from "react";
import PagesContainer from "../layouts/PageContainer";
import Status from "../components/Status";
import { Box } from "@mui/material";
import Timer from "../components/Timer/Timer";
import StopWatch from "../components/Timer/Stopwatch";

const Participant: React.FC = () => {

  return (
    <PagesContainer role="Participant">
      <Status />
      <Box className="timer-container">
      <div>
        <p>Equipe NOM</p>
        <p>Stand NOM</p>
      </div>
      <StopWatch isAdmin={false} />
      </Box>

      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Participant;
