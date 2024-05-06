import { useRef, useState } from "react";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import ActivitySelection from "@/components/Activity/ActivitySelection";
import CustomSnackbar from "@/components/CustomSnackbar";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { ACTIVITY_API } from "@/routes/api/";

interface ActivityChoiceProps {
  setChosenActivityId: (activityId: number |string) => void;
}

interface IActivities {
  id: number;
  name: string;
}

const ActivityChoice: React.FC<ActivityChoiceProps> = ({
  setChosenActivityId,
}) => {
  
  const snackbarRef = useRef<CustomSnackbarMethods>(null);
  // Get selected activity
  const [selectedActivity, setSelectedActivity] = useState<IActivities | null>(
    null
  );
  const [newActivityName, setNewActivityName] = useState<string>("");


  const handleActivityNameChange = (name: string) => {
    setNewActivityName(name);
  };

  const handleCreateActivity = () => {
    if (!newActivityName || newActivityName == "") {
      snackbarRef.current?.showSnackbar("Il faudrait choisir un nom d'activité", "warning")
      return;
    }
    createActivity(newActivityName);
  };

  const createActivity = async (activityName: string) => {
    // User ID comes from the Gamemaster
    const userId = 3;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: activityName, user: userId }),
    };

    try {
      const response = await fetch(`${ACTIVITY_API.activities}/`, options);
      const responseData = await response.json(); // Parse the JSON response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Activity is created
      setChosenActivityId(responseData.activity_id);
    } catch (error) {
      snackbarRef.current?.showSnackbar(`Echec lors de la création de l'activité : ${error}`, "error" )
      console.error(`Failed to create activity: `, error);
    }
  };

  const handleActivitySelect = (activity: IActivities | null) => {
    setSelectedActivity(activity); // Temporarily store the selected activity
  };

  const handleJoinActivity = () => {
    if (!selectedActivity) {
      snackbarRef.current?.showSnackbar("Il faudrait choisir une activité !", "warning")
      return;
    }
    setChosenActivityId(selectedActivity.id); // Only set on button click
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "85%",
        p: 2, // Padding général pour l'intérieur du conteneur
        height: "75vh",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
        Choisissez votre activité
      </Typography>

      <Grid container gap={5}>
        <Grid item xs={12}>
          <ActivitySelection onActivitySelect={handleActivitySelect} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinActivity}
            sx={{ mt: 1, mb: 2, width: "100%" }}
          >
            Rejoindre
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Nom de l'activité"
            sx={{ width: "100%" }}
            variant="outlined"
            value={newActivityName}
            onChange={(e) => handleActivityNameChange(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{ mt: 1, mb: 2, width: "100%" }}
            onClick={handleCreateActivity}
          >
            Créer
          </Button>
        </Grid>
        <CustomSnackbar ref={snackbarRef} />
      </Grid>
    </Container>
  );
};

export default ActivityChoice;
