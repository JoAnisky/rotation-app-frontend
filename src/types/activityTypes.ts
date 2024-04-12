interface TeamMember {
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
  team: TeamMember[];
  pause_start_time: string | null;
  pause_duration: string | null;
  // Add other fields as necessary
}
