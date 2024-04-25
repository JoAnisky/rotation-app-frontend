import React from "react";
import Status from "@/components/Status";
import { Box, Container } from "@mui/material";
import Stopwatch from "@/components/Timer/Stopwatch";

interface StatusProps {
  standName?: string | undefined;
}

const Stand: React.FC<StatusProps> = ({ standName }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "85%",
        p: 2,
        height: "75vh",
        justifyContent: "center",
        gap: "10px"
      }}
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
    </Container>
  );
};

export default Stand;
