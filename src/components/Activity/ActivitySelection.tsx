import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { ACTIVITY_API } from "../../routes/api/activityRoutes";

interface IActivites {
  id: number;
  name: string;
}

interface ActivitySelectionProps {
  onActivitySelect: (activity: IActivites | null) => void;
}

const ActivitySelection: React.FC<ActivitySelectionProps> = ({
  onActivitySelect,
}) => {
  // Stands for user selection fetched from : All Stand entries
  const [fetchedActivities, activitiesLoading] = useFetch<IActivites[]>(
    ACTIVITY_API.activities
  );
  const [activities, setActivities] = useState<IActivites[]>([]);

  useEffect(() => {
    if (Array.isArray(fetchedActivities)) {
      setActivities(fetchedActivities);
    } else {
      setActivities([]);
    }
  }, [fetchedActivities]);

  return (
    <>
      <Autocomplete
        disablePortal
        id="activity-choice"
        options={activities}
        getOptionLabel={(option) => option.name}
        onChange={(event, value: IActivites | null) => {
          onActivitySelect(value); // propagate the selected activity upwards
        }}
        loading={activitiesLoading} // Set the loading prop based loading state
        loadingText="Chargement..." // loading text
        noOptionsText="Aucune option" // text displayed when there are no options
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField {...params} label="Quelle activité insolite ?" />
        )}
      />
    </>
  );
};

export default ActivitySelection;
