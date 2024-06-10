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
  const [nextStandNames, setNextStandNames] = useState<{ teamId: number; nextStandName: string | null }[]>([]);

  const [currentTeams, setCurrentTeams] = useState<ITeam[]>([]);
  const [nextTeams, setNextTeams] = useState<ITeam[]>([]);

  // Get base Scenario
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
      return null; // if stand not found
    },
    [currentScenario]
  );

  // Find team(s) name(s) by standId using the currentScenario first element
  const findTeamsByStandId = useCallback(
    (standId: number): ITeam[] => {
      if (currentScenario) {
        const firstScenario = currentScenario[0];
        if (firstScenario) {
          const stand = firstScenario.find(stand => stand.standId === standId);
          if (stand) {
            return stand.teams.map(team => ({
              teamId: team.teamId,
              teamName: team.teamName
            }));
          }
        }
      }
      return []; // Retourne un tableau vide si aucun stand ou aucune équipe n'est trouvée
    },
    [currentScenario]
  );

  // Find next stand(s) for current team(s)
  const findNextStandByTeamId = useCallback(
    (teamId: number): string | null => {
      if (baseScenario && currentScenario) {
        const currentIndex = baseScenario.findIndex(scenario =>
          scenario.some(stand => stand.teams.some(team => team.teamId === teamId))
        );

        if (currentIndex !== -1 && currentIndex < baseScenario.length - 1) {
          const nextScenario = currentScenario[currentIndex + 1];
          const nextStand =
            nextScenario && nextScenario.find(stand => stand.teams.some(team => team.teamId === teamId));
          if (nextStand) {
            return nextStand.standName;
          }
        }
      }
      return null;
    },
    [baseScenario, currentScenario]
  );

  // Find next Arriving team(s)
  const findTeamsArrivingNextByStandId = useCallback(
    (standId: number): ITeam[] => {
      if (baseScenario && currentScenario) {
        const currentIndex = baseScenario.findIndex(scenario => scenario.some(stand => stand.standId === standId));
        if (currentIndex !== -1 && currentIndex < baseScenario.length - 1) {
          const nextScenario = currentScenario[currentIndex + 1];
          const nextStand = nextScenario && nextScenario.find(stand => stand.standId === standId);
          if (nextStand) {
            return nextStand.teams.map(team => ({
              teamId: team.teamId,
              teamName: team.teamName
            }));
          }
        }
      }
      return [];
    },
    [baseScenario, currentScenario]
  );

  useEffect(() => {
    if (userRole === "ROLE_ANIMATOR" && animatorInfo) {
      setStandName(animatorInfo[0].name);
      const teams = findTeamsByStandId(animatorInfo[0].id);
      setCurrentTeams(teams);

      // Loop on each teamId to find next stand
      const nextStandNames = teams.map(team => ({
        teamId: team.teamId,
        nextStandName: findNextStandByTeamId(team.teamId)
      }));
      setNextStandNames(nextStandNames);

      const nextTeamsArriving = findTeamsArrivingNextByStandId(animatorInfo[0].id);
      setNextTeams(nextTeamsArriving);
    } else if (userRole === "ROLE_PARTICIPANT" && teamInfo) {
      setStandName(findStandNameByTeamId(teamInfo[0].teamId));
      const nextStandName = findNextStandByTeamId(teamInfo[0].teamId);
      setNextStandNames([{ teamId: teamInfo[0].teamId, nextStandName }]);
      setCurrentTeams([{ teamId: teamInfo[0].teamId, teamName: teamInfo[0].teamName }]);
    }
  }, [
    animatorInfo,
    teamInfo,
    userRole,
    standName,
    findTeamsByStandId,
    findStandNameByTeamId,
    findNextStandByTeamId,
    findTeamsArrivingNextByStandId
  ]);

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
                {currentTeams[0].teamName}
              </Box>
              <Box mx={1}>VS</Box>
              <Box bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {currentTeams[1].teamName}
              </Box>
            </>
          ) : (
            currentTeams.map((team, index) => (
              <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {team.teamName}
              </Box>
            ))
          )}
        </Box>
        {/* <Stopwatch /> */}
      </Box>

      <Grid container spacing={1} direction="column" sx={{ width: "100%", gap: "10px" }}>
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <Typography variant="button">À la fin du temps :</Typography>
          {nextStandNames && nextStandNames.length > 0 ? (
            nextStandNames.map((item, index) => (
              <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1} mb={1}>
                {` ${currentTeams.find(team => team.teamId === item.teamId)?.teamName} va à ${
                  item.nextStandName || "Non spécifié"
                }`}
              </Box>
            ))
          ) : (
            <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
              Non spécifié
            </Box>
          )}
          <Typography variant="button" component="span">
            Équipe(s) suivante :
          </Typography>
          {nextTeams.length > 0 ? (
            nextTeams.map((team, index) => (
              <Box key={index} bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
                {team.teamName}
              </Box>
            ))
          ) : (
            <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
              Non spécifié
            </Box>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export default Stand;
