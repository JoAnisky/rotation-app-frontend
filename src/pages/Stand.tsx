import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Status from "@/components/Status";
import { IStand, ITeam } from "@/types/ActivityInterface";
import { ICurrentScenario, IScenarioStand } from "@/types/ScenarioInterface";
import { SCENARIO_API } from "@/routes/api";
import { useActivityContext } from "@/hooks/useActivityContext";
import { useAuth } from "@/hooks";
import { ActivityStatus } from "@/types/ActivityStatus";

interface StandProps {
  animatorInfo?: IStand[];
  teamInfo?: ITeam[];
}

const Stand: React.FC<StandProps> = ({ animatorInfo, teamInfo }) => {
  const { activityId } = useActivityContext();
  const { userRole } = useAuth();

  // Get the scenario
  const [baseScenario, setBaseScenario] = useState<ICurrentScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<ICurrentScenario[]>([]);
  const [status, setStatus] = useState<ActivityStatus | null>(null);

  const [lastTurn, setLastTurn] = useState<boolean>(false);

  const [standName, setStandName] = useState<string | null>(null);
  const [nextStandNames, setNextStandNames] = useState<{ teamId: number; nextStandName: string | null }[]>([]);

  const [currentTeams, setCurrentTeams] = useState<ITeam[]>([]);
  const [nextTeams, setNextTeams] = useState<ITeam[]>([]);

  // Get base Scenario
  const fetchScenario = useCallback(async () => {
    if (activityId) {
      try {
        const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));
        const data = await response.json();
        setBaseScenario(data[0].base_scenario);
        setCurrentScenario(data[0].current_scenario);
        setStatus(data[0].status);
      } catch (err) {
        setBaseScenario([]);
        console.error("erreur de fetch : ", err);
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

  useEffect(() => {

    if (currentScenario && currentScenario.length === 1) {
      setLastTurn(true);
    } else {
      setLastTurn(false);
    }
  }, [currentScenario]);

  const findStandNameByTeamId = useCallback(
    (teamId: number): string | null => {
      if (currentScenario && currentScenario.length > 0) {
        const firstScenario = currentScenario[0]; // Get the first line of current scenario

        for (const stand of Object.values(firstScenario)) {
          const foundTeam = stand.teams.find((team: ITeam) => team.teamId === teamId);
          if (foundTeam) {
            return stand.standName;
          }
        }
      }
      return null; // Return null if no corresponding stand found
    },
    [currentScenario]
  );

  // Find team(s) name(s) by standId using the currentScenario first element
  const findTeamsByStandId = useCallback(
    (standId: number): ITeam[] => {
      if (currentScenario && currentScenario.length > 0) {
        const firstScenario = currentScenario[0]; // Get the first line of current scenario
        const stand = Object.values(firstScenario).find((stand: IScenarioStand) => stand.standId === standId);

        if (stand) {
          return stand.teams.map((team: ITeam) => ({
            teamId: team.teamId,
            teamName: team.teamName
          }));
        }
      }
      return []; // Return an empty array if no corresponding team found
    },
    [currentScenario]
  );

  // Find next stand(s) for current team(s)
  const findNextStandByTeamId = useCallback(
    (teamId: number): string | null => {
      if (baseScenario.length > 0 && currentScenario.length > 1) {
        const currentIndex = baseScenario.findIndex(scenario =>
          Object.values(scenario).some((stand: IScenarioStand) =>
            stand.teams.some((team: ITeam) => team.teamId === teamId)
          )
        );

        if (currentIndex !== -1 && currentIndex < baseScenario.length - 1) {
          const nextScenario = currentScenario[currentIndex + 1];
          const nextStand = Object.values(nextScenario).find((stand: IScenarioStand) =>
            stand.teams.some((team: ITeam) => team.teamId === teamId)
          );

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
      if(currentScenario){
        if (baseScenario.length > 0 && currentScenario.length > 1) {
          const currentIndex = baseScenario.findIndex(scenario =>
            Object.values(scenario).some(stand => stand.standId === standId)
          );
          if (currentIndex !== -1 && currentIndex < baseScenario.length - 1) {
            const nextScenario = currentScenario[currentIndex + 1];
            const nextStand = Object.values(nextScenario).find((stand: IScenarioStand) => stand.standId === standId);
            if (nextStand) {
              return nextStand.teams.map((team: ITeam) => ({
                teamId: team.teamId,
                teamName: team.teamName
              }));
            }
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
      <Status status={status} />

      {/** Up display for Team name or Stand name */}
      <Box sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }} p={1} borderRadius={1}>
        
          {userRole === "ROLE_ANIMATOR" ? (
            <Box border={1} borderColor="primary.main" borderRadius={1} p={1}>
              <Typography variant="h6" component="h6"> Stand {standName}</Typography>
             
            </Box>
          ) : (
            <Box border={1} borderColor="primary.main" borderRadius={1} p={1}>
              <Typography variant="h6" component="h6">Équipe {currentTeams.length > 0 ? currentTeams[0].teamName : "Nom d'équipe non disponible"}</Typography>
            </Box>
          )}
        
      </Box>

      <Box className="timer-container" sx={{ alignSelf: "center", textAlign: "center" }}>
        <Typography variant="h6" component="h6">
          {status === "NOT_STARTED" && "Activité non démarrée"}
          {status === "ROTATING" && userRole !== "ROLE_ANIMATOR" && (
            <>
              <p>On change de stand !</p>
              <p>Aller à </p>
              {nextStandNames.map((item, index) => (
                <Box key={index} bgcolor="secondary.main" color="primary.contrastText" borderRadius={1}>
                  {item.nextStandName || "Non spécifié"}
                </Box>
              ))}
            </>
          )}
          {status === "ROTATING" && userRole === "ROLE_ANIMATOR" && (
            <>
              <p>Vous allez accueillir</p>
            </>
          )}
          {status === "COMPLETED" && "Activité terminée !"}
          {status !== "NOT_STARTED" &&
            status !== "ROTATING" &&
            status !== "COMPLETED" &&
            userRole == "ROLE_PARTICIPANT" &&
            ((
              <>
                <Typography variant="h5">Stand</Typography>
                <Box bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                  {standName}
                </Box>
              </>
            ) ||
              "Pas de stand attribué")}
        </Typography>
        <Box p={1} display="flex" alignItems="center">
          {status === "ROTATING" ? (
            nextTeams.length > 1 ? (
              <>
                <Box bgcolor="secondary.main" color="primary.contrastText" p={1} borderRadius={1}>
                  {nextTeams[0].teamName}
                </Box>
                <Box mx={1}>VS</Box>
                <Box bgcolor="secondary.main" color="primary.contrastText" p={1} borderRadius={1}>
                  {nextTeams[1].teamName}
                </Box>
              </>
            ) : (
              nextTeams.map((team, index) => (
                <Box key={index} bgcolor="secondary.main" color="primary.contrastText" p={1} borderRadius={1}>
                  {team.teamName}
                </Box>
              ))
            )
          ) : currentTeams.length > 1 ? (
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
            userRole === "ROLE_ANIMATOR" &&
            currentTeams.map((team, index) => (
              <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                {team.teamName}
              </Box>
            ))
          )}
        </Box>
        {/* <Stopwatch /> */}
      </Box>

      {/**Bottom part */}
      <Grid container spacing={1} direction="column" sx={{ width: "100%", gap: "10px" }}>
        {status !== "COMPLETED" && (
          <Box sx={{ mt: "auto", textAlign: "center" }}>
            {lastTurn ? (
              <Box bgcolor="success.main" color="primary.contrastText" p={1} borderRadius={1}>
                Dernier tour !
              </Box>
            ) : (
              <>
                <Typography variant="button">Stand suivant</Typography>
                {nextStandNames && nextStandNames.length > 0 ? (
                  nextStandNames.map((item, index) => (
                    <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1} mb={1}>
                      {userRole === "ROLE_ANIMATOR"
                        ? `Equipe ${currentTeams.find(team => team.teamId === item.teamId)?.teamName} va à ${
                            item.nextStandName || "Non spécifié"
                          }`
                        : item.nextStandName
                        ? item.nextStandName
                        : status === "NOT_STARTED"
                        ? "Activitée non démarrée"
                        : "Non spécifié"}
                    </Box>
                  ))
                ) : (
                  <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
                    Non spécifié
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {userRole === "ROLE_ANIMATOR" && !lastTurn && status !== "COMPLETED" && (
          <Box sx={{ mt: "auto", textAlign: "center" }}>
            <Typography variant="button" component="span">
              Équipe(s) suivante :
            </Typography>
            {nextTeams.length > 0 ? (
              nextTeams.map((team, index) => (
                <Box key={index} bgcolor="secondary.main" color="primary.contrastText" p={1} borderRadius={1} mb={1}>
                  {team.teamName}
                </Box>
              ))
            ) : (
              <Box bgcolor="text.secondary" color="primary.contrastText" p={1} borderRadius={1}>
                Non spécifié
              </Box>
            )}
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default Stand;
