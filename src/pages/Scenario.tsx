import { useEffect, useState } from "react";
import { Box, CssBaseline, Typography, Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import useFetch from "../hooks/useFetch";
import { SCENARIO_API } from "../routes/api/scenarioRoutes";

// Define the type for the individual scenario entries under each key like "Codage intensif"
interface ScenarioEntry {
  id: number;
  name: string;
}

// This maps the dynamic key to the list of scenario entries
interface DynamicScenario {
  [key: string]: ScenarioEntry[];
}

// The top-level structure for each item in the base scenario array
interface BaseScenarioItem {
  [key: string]: DynamicScenario;
}

const Scenario = () => {
  const [scenarios, setScenarios] = useState<BaseScenarioItem[]>([]);
  const [data, loading, error] = useFetch<
    Array<{ base_scenario: BaseScenarioItem[] }>
  >(SCENARIO_API.scenarioByActivityId("27"));

  useEffect(() => {
    if (data && data.length > 0) {
      setScenarios(data[0].base_scenario);
    }
  }, [data]);

  useEffect(() => {
    console.log(scenarios);
  }, [scenarios]); // To log the updated state

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CssBaseline />
      <Box height="100%" display="flex" flexDirection="column">
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
          Affichage du scenario :
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%' }}>
          {scenarios.map((scenario, idx) => (
            <Card key={idx} sx={{ mb: 1, width: '90%', maxWidth: 700, padding :0 }}>
              <CardHeader title={`Tour n°${idx + 1}`} />
              <CardContent>
                {Object.entries(scenario).map(([key, entries]) => (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Stand {key}</Typography>
                    <List>
                      {entries.map((entry: ScenarioEntry) => (
                        <ListItem key={entry.id} sx={{ py: 0.5 }}>{entry.name}</ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Scenario;
