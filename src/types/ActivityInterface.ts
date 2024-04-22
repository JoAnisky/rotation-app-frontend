interface TeamMember {
  id: number;
  name: string;
}

export interface IStands {
  id: number;
  name: string;
  isCompetitive: boolean;
}
export interface ITeams {
  id: number;
  name: string;
}
export interface IActivityData {
  name: string;
  activity_date: Date | null;
  activity_start_time: string | null;
  createdAt: Date;
  global_duration: number | null;
  nb_participants: number | null;
  nb_teams: number | null;
  rotation_duration: number | null;
  stand_duration: number | null;
  status: string;
  team: TeamMember[] | null;
  pause_start_time: string | null;
  pause_duration: string | null;
  stands: IStands[] | null;   // This can be null
  teams: ITeams[] | null;     // This can be null
}
