import React from "react";
import PagesContainer from "@/layouts/PageContainer";
import Status from "@/components/Status";
import { Box } from "@mui/material";
import Stopwatch from "@/components/Timer/Stopwatch";

interface StatusProps {
  role: string;
  standName: string | undefined;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
}

const Stand: React.FC<StatusProps> = ({ role, standName, handleChangeSelection, animatorStandSetted }) => {
  return (
    <PagesContainer
      role={role}
      handleChangeSelection={() => handleChangeSelection?.()}
      animatorStandSetted={animatorStandSetted}
    >
      <Status />
      <h2>{standName}</h2>
      <Box className="timer-container">
        <div>
          <p>Equipe NOM</p>
        </div>
        <Stopwatch />
      </Box>

      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </PagesContainer>
  );
};

export default Stand;
