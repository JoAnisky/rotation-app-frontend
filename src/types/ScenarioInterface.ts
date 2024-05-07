// Définir une interface pour représenter une équipe
interface Team {
  teamId: number;
  teamName: string;
}

// Définir une interface pour représenter un stand
interface Stand {
  standId: number;
  standName: string;
  teams: Team[];
}

// Définir une interface pour représenter une activité de scénario
export interface ScenarioActivity {
  [key: string]: Stand;
}

export interface IScenario {
  id: number;
  base_scenario: ScenarioActivity[];
  current_scenario: ScenarioActivity;
  activity: {
    id: number;
  };
}

