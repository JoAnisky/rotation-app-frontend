import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import { SCENARIO_API } from "@/routes/api";
import { IScenario } from "@/types/ScenarioInterface";

interface ActivityControlsProps {
  activityId: number | string;
}

const ActivityControls: React.FC<ActivityControlsProps> = ({ activityId }) => {

  /**
   * Gets the Scenario in database
   * @returns
   */
  const fetchScenario = useCallback(async (): Promise<IScenario | null> => {
    const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const scenario: IScenario[]  = await response.json();
    return scenario.length > 0 ? scenario[0] : null;
  }, [activityId]);

  /**
   * Update the current scenario
   * @param scenarioData Scenario data
   */
  const updateCurrentScenario = useCallback(async (scenarioData: IScenario) => {
    // Gets the scenario ID
    const scenarioId = scenarioData.id;
    // Gets the base_scenario corresponding line (turn number)
    const currentScenario = scenarioData.base_scenario[0];

    console.log("firstTurn : ", currentScenario);
    console.log("scenarioData : ", scenarioData);

    if (!scenarioData) {
      console.error("No scenario data available to update");
      return;
    }
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_scenario: currentScenario })
    };

    try {
      const response = await fetch(SCENARIO_API.getScenarioById(scenarioId), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Base scenario updated successfully");
    } catch (error) {
      console.error("Failed to update base scenario: ", error);
    }
  }, []);

  // Launch the game
  const handleStart = async () => {
    const currentScenario = await fetchScenario();
    currentScenario && updateCurrentScenario(currentScenario);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button variant="contained" onClick={handleStart}>
        Lancer la partie
      </Button>
      <Button variant="contained"> Rotation</Button>
      <Button variant="contained"> Stand</Button>
      <Button variant="outlined"> Arrêter la partie</Button>
    </Box>
  );
};

export default ActivityControls;
