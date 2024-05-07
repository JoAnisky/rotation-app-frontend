import { useEffect, useState } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { SCENARIO_API } from "@/routes/api/";
import { IScenario } from "@/types/ScenarioInterface";

// Définir une interface pour représenter une équipe
interface Team {
  teamId: number;
  teamName: string;
}

// Définir une interface pour représenter un stand
interface Stand {
  standId: number;
  standName: string;
  teams: Team[];
}

// Définir une interface pour représenter un tour
type Turn = Stand[];
type ApiData = IScenario[];

interface ScenarioProps {
  chosenActivityId: number | string;
}


const Scenario: React.FC<ScenarioProps> = ({ chosenActivityId }) => {
  const [scenario, setScenario] = useState<Turn[]>([]);

  const [data, loading, error] = useFetch<ApiData>(SCENARIO_API.getScenarioByActivityId(chosenActivityId));

  useEffect(() => {
    if (data && data.length > 0 && data[0].base_scenario) {
      setScenario(data[0].base_scenario);
    }
  }, [data]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
      <CssBaseline />
      {/* Content Area */}
      <Box
        flexGrow={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2, // Adding some padding inside the box
          overflow: "auto" // Allows scrolling inside this box if content overflows
        }}
      >
        {loading && (
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
            Loading...
          </Typography>
        )}
        {error && (
          <Box>
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
              Oups :(
            </Typography>
            {error.message}
          </Box>
        )}
        {!loading && !error && (
          <>
            <Typography>Affichage du scenario :</Typography>
            {scenario.length > 0 ? (
              scenario.map((turn, index) => (
                <Card key={index} sx={{ mb: 1, width: "90%", maxWidth: 700, padding: 0 }}>
                  <CardHeader title={`Tour n°${index + 1}`} />
                  <CardContent>
                    {Array.isArray(turn) &&
                      turn.map((stand, standIndex) => (
                        <Box key={standIndex} sx={{ mb: 1 }}>
                          <Typography variant="subtitle1">Stand {stand.standName}</Typography>
                          <List>
                            {stand.teams &&
                              Array.isArray(stand.teams) &&
                              stand.teams.map((team, teamIndex) => (
                                <ListItem key={teamIndex} sx={{ py: 0.5 }}>
                                  {team.teamName}
                                </ListItem>
                              ))}
                          </List>
                        </Box>
                      ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>Pas de scénario créé pour cette activité</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Scenario;
