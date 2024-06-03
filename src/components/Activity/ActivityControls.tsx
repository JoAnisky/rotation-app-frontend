import React, { useCallback, useState } from "react";
import { Box, Button } from "@mui/material";
import { SCENARIO_API } from "@/routes/api";
import { IScenario, ScenarioActivity } from "@/types/ScenarioInterface";

interface ActivityControlsProps {
  activityId: number | string;
}

const ActivityControls: React.FC<ActivityControlsProps> = ({ activityId }) => {
  const [gameLaunched, setGameLaunched] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(false);
  const [standEnabled, setStandEnabled] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ScenarioActivity | null>(null);
  const [initialScenario, setInitialScenario] = useState<ScenarioActivity | null>(null);
  const [remainingScenarios, setRemainingScenarios] = useState<ScenarioActivity[]>([]);

  /**
   * Gets the Scenario in database
   * @returns
   */
  const fetchScenario = useCallback(async (): Promise<IScenario | null> => {
    const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const scenario: IScenario[] = await response.json();
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
    const currentScenario = scenarioData.base_scenario;

    // console.log("scenarioData : ", scenarioData);
    // console.log("firstTurn : ", currentScenario);

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
    setGameLaunched(true);
    setRotationEnabled(false);
    setStandEnabled(true);
    const fetchedScenario = await fetchScenario();
    if (fetchedScenario) {
      setCurrentScenario(fetchedScenario.current_scenario);
      setInitialScenario(fetchedScenario.current_scenario); // Stocker la copie initiale du scénario
      setRemainingScenarios(fetchedScenario.base_scenario);
    }
  };

  // Handle rotation
  const handleRotation = () => {
    setRotationEnabled(false);
    setStandEnabled(true);
  };

  // Handle stand
  const handleStand = async () => {
    if (remainingScenarios.length > 0) {
      const newRemainingScenarios = remainingScenarios.slice(1);
      setRemainingScenarios(newRemainingScenarios);

      if (currentScenario) {
        const updatedScenario = {
          ...currentScenario,
          base_scenario: newRemainingScenarios
        };

        setCurrentScenario(updatedScenario);
        await updateCurrentScenario(updatedScenario);

        if (newRemainingScenarios.length === 0) {
          setGameLaunched(false);
          setRotationEnabled(true);
          setStandEnabled(false);
          resetScenario();
        } else {
          setRotationEnabled(true);
          setStandEnabled(false);
        }
      }
    } else {
      setGameLaunched(false);
      setRotationEnabled(true);
      setStandEnabled(false);
      resetScenario();
    }
  };

  // Réinitialiser currentScenario à la position de départ
  const resetScenario = () => {
    console.log("initialScenario: ", initialScenario);
    if (initialScenario) {
      setCurrentScenario(initialScenario);
    }
  };

  // Handle stop
  const handleStop = () => {
    setGameLaunched(false);
    setRotationEnabled(true);
    setStandEnabled(true);
    resetScenario(); // Réinitialiser le scénario à la position de départ
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button variant="contained" onClick={handleStart} disabled={gameLaunched}>
        Lancer la partie
      </Button>
      <Button variant="contained" onClick={handleRotation} disabled={!rotationEnabled}>
        Rotation
      </Button>
      <Button variant="contained" onClick={handleStand} disabled={!standEnabled}>
        Stand
      </Button>
      <Button variant="outlined" onClick={handleStop} disabled={!gameLaunched}>
        Arrêter la partie
      </Button>
    </Box>
  );
};

export default ActivityControls;
