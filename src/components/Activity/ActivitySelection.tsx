import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ACTIVITY_API } from "@/routes/api/";
import { useAuth } from "@/hooks";
import { UseFetchOptions } from "@/hooks/useFetch";
interface IActivites {
  id: number;
  name: string;
}

interface ActivitySelectionProps {
  onActivitySelect: (activity: IActivites | null) => void;
}

const ActivitySelection: React.FC<ActivitySelectionProps> = ({ onActivitySelect }) => {
  const auth = useAuth();

  const { csrfToken } = auth;

  // useMemo to memorize headers
  const headers = useMemo(() => {
    const h: HeadersInit = {
      "Content-Type": "application/json"
    };
    if (csrfToken) {
      h["x-xsrf-token"] = csrfToken;
    }
    return h;
  }, [csrfToken]);

  // useMemo to memorize query options
  const requestOptions: UseFetchOptions = useMemo(() => ({
    method: "GET",
    headers: headers,
    credentials: "include"
  }), [headers]);

  // Stands for user selection fetched from : All Stand entries
  const [fetchedActivities, activitiesLoading] = useFetch<IActivites[]>(ACTIVITY_API.activities, requestOptions);
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
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        getOptionLabel={option => option.name}
        onChange={(_event, value) => onActivitySelect(value)}
        loading={activitiesLoading}
        loadingText="Chargement..."
        noOptionsText="Aucune option"
        sx={{ width: "100%" }}
        renderInput={params => <TextField {...params} label="Quelle activité insolite ?" />}
      />
    </>
  );
};

export default ActivitySelection;
