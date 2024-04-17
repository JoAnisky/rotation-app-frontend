import { useEffect, useState } from "react";
import { Box, CssBaseline, Typography } from "@mui/material";
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
        <Box display="flex" flexDirection="column" alignItems="center">
          {scenarios.map((scenario, idx) => (
            <Box key={idx}>
              <Typography variant="h6">Tour n°{idx + 1}</Typography>
              {Object.entries(scenario).map(([key, entries]) => (
                <div key={key}>
                  <Typography>{key}:</Typography>
                  {entries.map((entry: ScenarioEntry) => (
                    <Typography key={entry.id}>{entry.name}</Typography>
                  ))}
                </div>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Scenario;
