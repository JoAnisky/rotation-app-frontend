import React from "react";
import PagesContainer from "../layouts/PageContainer";
import Status from "../components/Status";
import { Box } from "@mui/material";
import Timer from "../components/Timer/Timer";

const Participant: React.FC = () => {
  return (
    <PagesContainer role="Participant">
      <Status />
      <Box className="timer-container">
      <div>
        <p>Equipe NOM</p>
        <p>Stand NOM</p>
      </div>
      <Timer />
      </Box>

      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Participant;
