import { ITeam } from "./ActivityInterface";

// Définir une interface pour représenter un stand
interface IScenarioStand {
  standId: number;
  standName: string;
  teams: ITeam[];
}

// Définir une interface pour représenter une activité de scénario
export interface ScenarioActivity {
  [key: string]: IScenarioStand;
}

export interface IScenario {
  id: number;
  base_scenario: ScenarioActivity[];
  current_scenario: ScenarioActivity;
  activity: {
    id: number;
  };
}

