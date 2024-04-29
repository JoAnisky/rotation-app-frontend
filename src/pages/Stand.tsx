import React, { useEffect, useState } from "react";
import Status from "@/components/Status";
import { Box, Container, Grid, Typography } from "@mui/material";
import Stopwatch from "@/components/Timer/Stopwatch";
import { IStand } from "@/types/ActivityInterface";

interface StatusProps {
  standInfos: IStand[];
}

const Stand: React.FC<StatusProps> = ({ standInfos }) => {
  const [standName, setStandName] = useState<string | undefined>();

  const [currentTeamName, setCurrentTeamName] = useState<string>("Nom team");
  const [nextTeamName, setNexTeamName] = useState<string>("Nom team");
  
  useEffect(() => {

    if (standInfos.length > 0) {
      const { name } = standInfos[0];
      setStandName(name);
    }
  }, [standInfos]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        width: "85%",
        p: 2,
        height: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* Timer and names section centered */}
      <Status />
      <Box className="timer-container" sx={{ alignSelf: "center", textAlign: "center" }}>
        <Typography variant="h6" component="h1">
          {standName || "Pas récupéré le nom du stand"}
        </Typography>
        <Box bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
          {currentTeamName}
        </Box>
        {/* <Stopwatch /> */}
      </Box>

      {/* Footer content aligned at the bottom of the page */}
      <Grid container spacing={1} direction="column" sx={{ width: "100%", gap:"10px" }}>
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <Typography variant="button">À la fin du temps, votre équipe va :</Typography>
          <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
            {standName || "Non spécifié"}
          </Box>
          <Typography variant='button' component="span">Équipe suivante :</Typography>
          <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
            {nextTeamName || "Non spécifié"}
          </Box>
            (Actuellement sur 'nom stand actuel')
        </Box>
      </Grid>
    </Container>
  );
};

export default Stand;
