import { useEffect, useState } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { SCENARIO_API } from "@/routes/api/";

type TeamNames = string[];

type ScenarioEntry = {
  [activityName: string]: TeamNames;
};

type BaseScenario = {
  data: ScenarioEntry[];
  success: boolean;
};

type ApiResponse = {
  id: number;
  base_scenario: BaseScenario;
  current_scenario: null; // Adjust as needed
  activity: { id: number };
};

type ApiData = ApiResponse[];

interface ScenarioProps {
  chosenActivityId: number | string;
}

const Scenario: React.FC<ScenarioProps> = ({ chosenActivityId }) => {

  const [scenario, setScenario] = useState<ScenarioEntry[]>([]);

  const [data, loading, error] = useFetch<ApiData>(SCENARIO_API.getScenarioByActivityId(chosenActivityId));

  // useEffect(() => {

  // }, [scenario]); // To log the updated state

  useEffect(() => {
    if (data && data.length > 0 && data[0].base_scenario) {
      setScenario(data[0].base_scenario.data);
    }
  }, [data]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
      <CssBaseline />
      {/* Content Area */}
      <Box flexGrow={1} sx={{
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
              scenario.map((scenario, index) => (
                <Card key={index} sx={{ mb: 1, width: "90%", maxWidth: 700, padding: 0 }}>
                  <CardHeader title={`Tour n°${index + 1}`} />
                  <CardContent>
                    {Object.entries(scenario).map(([key, entries]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1">Stand {key}</Typography>
                        <List>
                          {entries.map((teamName, index) => (
                            <ListItem key={`${teamName}-${index}`} sx={{ py: 0.5 }}>
                              {teamName}
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
