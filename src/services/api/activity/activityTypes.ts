interface TeamMember {
  id: number;
  name: string;
}

export interface IActivityData {
  name: string;
  activity_date: Date | null;
  activity_start_time: string | null;
  createdAt: Date;
  global_duration: number;
  nb_participants: number;
  nb_teams: number;
  rotation_duration: number;
  stand_duration: number;
  status: string;
  team: TeamMember[];
  // Add other fields as necessary
}
