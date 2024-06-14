import { ITeam } from "./ActivityInterface";

// Définir une interface pour représenter un stand
export interface IScenarioStand {
  standId: number;
  standName: string;
  teams: ITeam[];
}

// Définir une interface pour représenter une activité de scénario
export interface ICurrentScenario {
  [key: string]: IScenarioStand;
}

export interface IScenario {
  id: number;
  base_scenario: ICurrentScenario[];
  current_scenario: ICurrentScenario[];
  activity: {
    id: number;
  };
  status: string;
}
