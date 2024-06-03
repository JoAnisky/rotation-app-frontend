import React, { useCallback, useEffect, useState } from "react";
import Status from "@/components/Status";
import { Box, Container, Grid, Typography } from "@mui/material";
// import Stopwatch from "@/components/Timer/Stopwatch";
import { IStand, ITeam } from "@/types/ActivityInterface";
import { IScenario, ScenarioActivity } from "@/types/ScenarioInterface";
import { SCENARIO_API } from "@/routes/api";
import { useActivityContext } from "@/hooks/useActivityContext";
import { useAuth } from "@/hooks";

interface StandProps {
  animatorInfo?: IStand[];
  teamInfo?: ITeam[];
}

const Stand: React.FC<StandProps> = ({ animatorInfo, teamInfo }) => {
  const { activityId } = useActivityContext();
  const { userRole } = useAuth();

  // Get the scenario
  const [baseScenario, setBaseScenario] = useState<IScenario[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentScenario, setCurrentScenario] = useState<ScenarioActivity | null>(null);

  const [standName, setStandName] = useState<string | null>(null);
  const [nextStand, setNextStand] = useState<string | null>(null);

  const [currentTeams, setCurrentTeams] = useState<string[]>([]);
  const [nextTeam, setNextTeam] = useState<string>("Nom team");

  // Fonction pour fetch les données du scénario
  const fetchScenario = useCallback(async () => {
    if (activityId) {
      setLoading(true);
      try {
        const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));
        const data = await response.json();
        setBaseScenario(data[0].base_scenario);
        setCurrentScenario(data[0].current_scenario);
      } catch (err) {
        setBaseScenario([]);
        console.error("erreur de fetch : ", err);
      } finally {
        setLoading(false);
      }
    }
  }, [activityId]);

  // Use Effect for fetching data when activityId changes and is not null
  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  // Fetch data every X seconds
  useEffect(() => {
   
      const interval = setInterval(() => {
      fetchScenario();
    }, 2000);

    return () => clearInterval(interval); // clear interval
  
  }, [fetchScenario]);

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

  // Fonction pour trouver les noms d'équipes par standId en utilisant le premier élément du scénario
  const findTeamNamesByStandId = useCallback(
    (standId: number): string[] => {
      if (currentScenario) {
        const firstScenario = currentScenario[0];
        if(firstScenario){
          console.log("firstScenario : ", firstScenario);
          const stand = firstScenario.find(stand => stand.standId === standId);
          console.log("stand : ", stand);
          if (stand) {
            return stand.teams.map(team => team.teamName);
          }
        }

      }
      return []; // Retourne un tableau vide si aucun stand ou aucune équipe n'est trouvée
    },
    [currentScenario]
  );

  useEffect(() => {
    if (userRole === "ROLE_ANIMATOR" && animatorInfo) {
      setStandName(animatorInfo[0].name);
      const teamNames = findTeamNamesByStandId(animatorInfo[0].id);
      setCurrentTeams(teamNames);

    } else if (userRole === "ROLE_PARTICIPANT" && teamInfo) {
      setStandName(findStandNameByTeamId(teamInfo[0].teamId));
      console.log(findStandNameByTeamId(teamInfo[0].teamId));
      setCurrentTeams(teamName);
    }
  }, [animatorInfo, teamInfo, userRole, standName, findStandNameByTeamId]);

  // useEffect(() => {
  //   console.log("Updated baseScenario:", baseScenario);
  // }, [baseScenario]);

  // useEffect(() => {
  //   console.log("Updatedm currentScenario:", currentScenario);
  // }, [currentScenario]);

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
        <Box p={1} display="flex" alignItems="center">
          {currentTeams.length > 1 ? (
            <>
              <Box bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {currentTeams[0]}
              </Box>
              <Box mx={1}>VS</Box>
              <Box bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {currentTeams[1]}
              </Box>
            </>
          ) : (
            currentTeams.map((teamName, index) => (
              <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {teamName}
              </Box>
            ))
          )}
        </Box>
        {/* <Stopwatch /> */}
      </Box>

      {/* Footer content aligned at the bottom of the page */}
      <Grid container spacing={1} direction="column" sx={{ width: "100%", gap: "10px" }}>
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <Typography variant="button">À la fin du temps, l'équipe va :</Typography>
          <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
            {standName || "Non spécifié"}
          </Box>
          <Typography variant="button" component="span">
            Équipe(s) suivante :
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
