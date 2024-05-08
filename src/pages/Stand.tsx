import React, { useCallback, useEffect, useState } from "react";
import Status from "@/components/Status";
import { Box, Container, Grid, Typography } from "@mui/material";
// import Stopwatch from "@/components/Timer/Stopwatch";
import { IStand, ITeam } from "@/types/ActivityInterface";
import { IScenario, ScenarioActivity  } from "@/types/ScenarioInterface";
import { SCENARIO_API } from "@/routes/api";
import { useActivityContext } from "@/hooks/useActivityContext";

interface StandProps {
  animatorInfo?: IStand[];
  teamInfo?: ITeam[];
}

const Stand: React.FC<StandProps> = ({ animatorInfo, teamInfo }) => {

  const { activityId, role } = useActivityContext();

  // Get the scenario
  const [baseScenario, setBaseScenario] = useState<IScenario[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentScenario, setCurrentScenario] = useState<ScenarioActivity | null>(null);

  const [standName, setStandName] = useState<string | null>(null);
  const [nextStand, setNextStand] = useState<string | null>(null);

  const [currentTeam, setCurrentTeam] = useState<string>("Nom team");
  const [nextTeam, setNextTeam] = useState<string>("Nom team");

  // Use Effect for fetching data when activityId changes and is not null
  useEffect(() => {
    const fetchData = async () => {
      if (activityId) {
        // Ensure there is an activityId
        setLoading(true);
        try {
          const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));

          const data = await response.json();
          setBaseScenario(data[0].base_scenario);
          setCurrentScenario(data[0].current_scenario);
        } catch (err) {
          setBaseScenario([]);
          console.error('erreur de fetch : ', err)
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [activityId]); // Dependency array includes activityId

  const findStandNameByTeamId = useCallback(
    (teamId: number): string | null => {
      if (currentScenario) {
        for (const key in currentScenario) {
          const stand = currentScenario[key];
          const foundTeam = stand.teams.find(team => team.teamId === teamId);
          if (foundTeam) {
            return stand.standName;
          }
        }
      }
      return null; // Retourne null si aucun stand correspondant n'est trouvé
    },
    [currentScenario]
  );
  
  useEffect(() => {
    if (role === "animator" && animatorInfo) {
      console.log("animatorInfo : ", animatorInfo[0].name);
      setStandName(animatorInfo[0].name);
    } else if (role === "participant" && teamInfo) {
      setStandName(findStandNameByTeamId(teamInfo[0].teamId));
      console.log(findStandNameByTeamId(teamInfo[0].teamId))
      setCurrentTeam(teamInfo[0].teamName);
    }
  }, [animatorInfo, teamInfo, role, standName, findStandNameByTeamId]);

  useEffect(() => {
    console.log("Updated baseScenario:", baseScenario)
  }, [baseScenario])

  useEffect(() => {
    console.log("Updated currentScenario:", currentScenario);
  }, [currentScenario]);



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
