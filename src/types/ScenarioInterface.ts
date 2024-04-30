export interface IScenario {
    id: number;
    base_scenario: BaseScenario[];
    current_scenario: CurrentScenario | null;
    activity: {  id: number};
}

interface BaseScenario {
    [activityName: string]: string[];
}

interface CurrentScenario {
    // Define this similarly if it has the same structure as BaseScenario
    // Adjust based on the actual data if different
}
