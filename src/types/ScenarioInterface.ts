export interface ScenarioActivity {
    [key: string]: string[]; // Clé dynamique, valeur est un tableau de strings
  }

export interface IScenario {
  id: number;
  base_scenario: ScenarioActivity[];
  current_scenario: ScenarioActivity;
  activity: {
    id: number;
  };
}

