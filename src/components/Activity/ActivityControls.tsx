import React, { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { SCENARIO_API } from "@/routes/api";
import { IScenario, ScenarioActivity } from "@/types/ScenarioInterface";
import Status from "../Status";
import { ActivityStatus } from "@/types/ActivityStatus";

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

  const [activityStatus, setActivityStatus] = useState<ActivityStatus | null>(null);

  /**
   * Gets the Scenario in database
   * @returns
   */
  const fetchScenario = useCallback(async (): Promise<IScenario | null> => {
    const response = await fetch(SCENARIO_API.getScenarioByActivityId(activityId));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const scenarios: IScenario[] = await response.json();

    if (scenarios.length > 0) {
      const scenario = scenarios[0];
      setActivityStatus(scenario.status as ActivityStatus);
      setScenarioId(scenario.id);

      return scenario;
    }
    return null;
  }, [activityId]);

  // Fetch the scenario when the component mounts
  useEffect(() => {
    const initializeScenario = async () => {
      await fetchScenario();
    };
    initializeScenario();
  }, [fetchScenario]);

  // track activity Status
  useEffect(() => {
    console.log("Status changed: ", activityStatus);

    switch (activityStatus) {
      case "COMPLETED":
      case "NOT_STARTED":
        setGameLaunched(false);
        setRotationEnabled(false);
        setStandEnabled(false);
        break;
      case "IN_PROGRESS":
        setGameLaunched(true);
        setRotationEnabled(true);
        setStandEnabled(false);
        break;
      case "ROTATING":
        setGameLaunched(true);
        setRotationEnabled(false);
        setStandEnabled(true);
        break;
      default:
        // Handle any other status or the initial state
        console.log("Unhandled status: ", activityStatus);
      // Optionally, set default states or do nothing
    }
  }, [activityStatus]);

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

  /**
   * Update activity status (stored in "scenario")
   */
  const updateActivityStatus = useCallback(async (scenarioId: number, activityStatus: ActivityStatus) => {
    if (!activityStatus) {
      console.error("No status data available to update");
      return;
    }

    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: activityStatus })
    };

    try {
      const response = await fetch(SCENARIO_API.getScenarioById(scenarioId), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Base scenario updated successfully");
      setActivityStatus(activityStatus);
    } catch (error) {
      console.error("Failed to update base scenario: ", error);
    }
  }, []);

  // Launch the game
  const handleStart = async () => {
    setGameLaunched(true);
    setRotationEnabled(true);
    setStandEnabled(false);
    const fetchedScenario = await fetchScenario();

    if (fetchedScenario) {
      setScenarioId(fetchedScenario.id);
      setBaseScenario(fetchedScenario.base_scenario);
      setRemainingScenarios(fetchedScenario.base_scenario);
      setCurrentScenario(fetchedScenario.base_scenario); // Initialiser currentScenario
      await updateCurrentScenario(scenarioId, baseScenario);
      await updateActivityStatus(scenarioId, "IN_PROGRESS");
    }
  };

  // Handle rotation
  const handleRotation = async () => {
    setRotationEnabled(false);
    setStandEnabled(true);
    await updateActivityStatus(scenarioId, "ROTATING");
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
      await updateActivityStatus(scenarioId, "IN_PROGRESS");

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

  /**
   * Reset Scenario
   */
  const resetScenario = async () => {
    setCurrentScenario([]);

    if (scenarioId) {
      await updateCurrentScenario(scenarioId, []);
      await updateActivityStatus(scenarioId, "COMPLETED");
    }
    setRemainingScenarios(baseScenario);
  };

  // Handle stop
  const handleStop = async () => {
    setGameLaunched(false);
    setRotationEnabled(false);
    setStandEnabled(false);
    await resetScenario(); // Reset current scenario to base scenario
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Status status={activityStatus} />
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
