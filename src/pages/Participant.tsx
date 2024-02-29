import React from "react";
import PagesContainer from "../layouts/PageContainer";
import Status from "../components/Status";
import Timer from "../components/Timer";
import { Box } from "@mui/material";

const Participant: React.FC = () => {
  return (
    <PagesContainer role="Participant">
      <Status />
      <Timer />
      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Participant;
