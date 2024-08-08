import React, { useCallback, useEffect, useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { SCENARIO_API } from "@/routes/api";
import { IScenario, ICurrentScenario } from "@/types/ScenarioInterface";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";

import { ActivityStatus } from "@/types/ActivityStatus";
import Status from "../Status";
import CustomSnackbar from "@/components/CustomSnackbar";

interface ActivityControlsProps {
  activityId: number | string;
}

const ActivityControls: React.FC<ActivityControlsProps> = ({ activityId }) => {

  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  const [gameLaunched, setGameLaunched] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(false);
  const [standEnabled, setStandEnabled] = useState(false);
  const [scenarioId, setScenarioId] = useState<number>(0);
  const [currentScenario, setCurrentScenario] = useState<ICurrentScenario[]>([]);
  const [baseScenario, setBaseScenario] = useState<ICurrentScenario[]>([]);
  const [remainingScenarios, setRemainingScenarios] = useState<ICurrentScenario[]>([]);

  const [lastTurn, setLastTurn] = useState<boolean>(false);
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
        console.log("Unhandled status: ", activityStatus);
    }
  }, [activityStatus]);

  const updateScenario = useCallback(
    async (scenarioId: number, currentScenario?: ICurrentScenario[], activityStatus?: ActivityStatus) => {
      if (!activityStatus && !currentScenario) {
        console.error("No data available to update");
        return;
      }
      const bodyData: { current_scenario?: ICurrentScenario[]; status?: ActivityStatus } = {};
console.log("currentScenario premier lancement : ", currentScenario);
      if (currentScenario) {
        bodyData.current_scenario = currentScenario;
        if (currentScenario.length === 1) {
          console.log("Dernier tour ! : ", currentScenario);
          setLastTurn(true);
        }
      }
      if (activityStatus) bodyData.status = activityStatus;

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      };

      try {
        const response = await fetch(SCENARIO_API.getScenarioById(scenarioId), options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Scenario updated successfully");
        if (activityStatus) setActivityStatus(activityStatus);
      } catch (error) {
        console.error("Failed to update scenario: ", error);
      }
    },
    []
  );

  // Launch the game
  const handleStart = async () => {
    const fetchedScenario = await fetchScenario();
  
    if (fetchedScenario) {
      if (!fetchedScenario.base_scenario) {
        snackbarRef.current?.showSnackbar("Il faudrait générer un scénario !", "warning");
        return;
      }
      setGameLaunched(true);
      setRotationEnabled(false);
      setStandEnabled(true);
      setScenarioId(fetchedScenario.id);
      setBaseScenario(fetchedScenario.base_scenario);
      setRemainingScenarios(fetchedScenario.base_scenario);
      setCurrentScenario(fetchedScenario.base_scenario);
      await updateScenario(fetchedScenario.id, fetchedScenario.base_scenario, "IN_PROGRESS");
    }else {
      snackbarRef.current?.showSnackbar("Aucun scénario récupéré !", "error");
    }
  };

  // Handle rotation
  const handleRotation = async () => {
    setRotationEnabled(false);
    setStandEnabled(true);
    await updateScenario(scenarioId, undefined, "ROTATING");
  };

  // Handle stand
  const handleStand = async () => {
    if (currentScenario.length === 0) {
      // Initial setting of currentScenario to baseScenario
      setCurrentScenario(baseScenario);
      await updateScenario(scenarioId, baseScenario);
    } else if (remainingScenarios.length > 0) {
      const newRemainingScenarios = remainingScenarios.slice(1);
      setRemainingScenarios(newRemainingScenarios);

      setCurrentScenario(newRemainingScenarios); // Mettre à jour currentScenario
      await updateScenario(scenarioId, newRemainingScenarios, "IN_PROGRESS");

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
    setLastTurn(false);
    if (scenarioId) {
      await updateScenario(scenarioId, [], "COMPLETED");
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
      {lastTurn && (
        <Typography color="warning.main" variant="h6" textAlign={"center"}>
          Dernier tour !
        </Typography>
      )}
      <Button variant="contained" onClick={handleStart} disabled={gameLaunched}>
        Lancer la partie
      </Button>
      <Button variant="contained" onClick={handleRotation} disabled={!rotationEnabled || lastTurn}>
        Rotation
      </Button>
      <Button variant="contained" onClick={handleStand} disabled={!standEnabled || lastTurn}>
        Stand
      </Button>
      <Button variant="outlined" color="error" onClick={handleStop} disabled={!gameLaunched}>
        Arrêter la partie
      </Button>
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default ActivityControls;
