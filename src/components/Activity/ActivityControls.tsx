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
  const [scenarioId, setScenarioId] = useState<number>(0);
  const [currentScenario, setCurrentScenario] = useState<ScenarioActivity[]>([]);
  const [baseScenario, setBaseScenario] = useState<ScenarioActivity[]>([]);
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
  const updateCurrentScenario = useCallback(async (scenarioId: number, currentScenario: ScenarioActivity[]) => {

    if (!currentScenario) {
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
      setScenarioId(fetchedScenario.id);
      setBaseScenario(fetchedScenario.base_scenario);
      setRemainingScenarios(fetchedScenario.base_scenario);
      setCurrentScenario(fetchedScenario.base_scenario); // Initialiser currentScenario
    }
  };

  // Handle rotation
  const handleRotation = () => {
    setRotationEnabled(false);
    setStandEnabled(true);
  };

  // Handle stand
  const handleStand = async () => {
    if (currentScenario.length === 0) {
      // Initial setting of currentScenario to baseScenario
      setCurrentScenario(baseScenario);
      await updateCurrentScenario(scenarioId, baseScenario);
    } else if (remainingScenarios.length > 0) {
      const newRemainingScenarios = remainingScenarios.slice(1);
      setRemainingScenarios(newRemainingScenarios);
      setCurrentScenario(newRemainingScenarios); // Mettre à jour currentScenario

      await updateCurrentScenario(scenarioId, newRemainingScenarios);

      if (newRemainingScenarios.length === 0) {
        setGameLaunched(false);
        setRotationEnabled(true);
        setStandEnabled(false);
        await resetScenario();
      } else {
        setRotationEnabled(true);
        setStandEnabled(false);
      }
    } else {
      setGameLaunched(false);
      setRotationEnabled(true);
      setStandEnabled(false);
      await resetScenario();
    }
  };

  // Réinitialiser currentScenario à la position de départ
  const resetScenario = async () => {
    setCurrentScenario(baseScenario);
    await updateCurrentScenario(scenarioId, baseScenario);
    console.log("resetScenario - baseScenario : ", baseScenario);
    setRemainingScenarios(baseScenario);
  };

  // Handle stop
  const handleStop = async () => {
    setGameLaunched(false);
    setRotationEnabled(true);
    setStandEnabled(true);
    await resetScenario(); // Réinitialiser le scénario à la position de départ
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
