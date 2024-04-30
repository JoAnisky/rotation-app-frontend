import React, { useEffect, useState } from "react";
import Status from "@/components/Status";
import { Box, Container, Grid, Typography } from "@mui/material";
// import Stopwatch from "@/components/Timer/Stopwatch";
import { IStand } from "@/types/ActivityInterface";
import { IScenario, ScenarioActivity } from "@/types/ScenarioInterface";
import { SCENARIO_API } from "@/routes/api";
import useFetch from "@/hooks/useFetch";

interface StatusProps {
  standInfos: IStand[];
  role: string;
}

const Stand: React.FC<StatusProps> = ({ standInfos, role }) => {
  const [data, loading, error] = useFetch<IScenario[]>(SCENARIO_API.getScenarioByActivityId(18));

  // Get the scenario
  const [baseScenario, setBaseScenario] = useState<ScenarioActivity[]>([]);

  const [currentScenario, setCurrentScenario] = useState<ScenarioActivity | null>(null);

  const [standName, setStandName] = useState<string | null>(null);
  const [nextStand, setNextStand] = useState<string | null>(null);

  const [currentTeam, setCurrentTeam] = useState<string>("Nom team");
  const [nextTeam, setNextTeam] = useState<string>("Nom team");

  useEffect(() => {
    console.log(role);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      // Since data is an array and you expect only one scenario object in it:
      const scenario = data[0]; // Access the first object of the array
  
      // Now you can safely assign base_scenario and current_scenario
      setBaseScenario(scenario.base_scenario);
      setCurrentScenario(scenario.current_scenario);
    }
  }, [data]);

  useEffect(() => {
    console.log("Updated baseScenario:", baseScenario);
  }, [baseScenario]);

  useEffect(() => {
    console.log("Updated currentScenario:", currentScenario);
  }, [currentScenario]);

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
          {currentTeam}
        </Box>
        {/* <Stopwatch /> */}
      </Box>

      {/* Footer content aligned at the bottom of the page */}
      <Grid container spacing={1} direction="column" sx={{ width: "100%", gap: "10px" }}>
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <Typography variant="button">À la fin du temps, votre équipe va :</Typography>
          <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
            {standName || "Non spécifié"}
          </Box>
          <Typography variant="button" component="span">
            Équipe suivante :
          </Typography>
          <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
            {nextTeam || "Non spécifié"}
          </Box>
          (Actuellement sur 'nom stand actuel')
        </Box>
      </Grid>
    </Container>
  );
};

export default Stand;
