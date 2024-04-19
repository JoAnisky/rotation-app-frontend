import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Alert,
  //   Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
// import { ActivityContext } from "../../contexts/ActivityContext";
import { IActivityData } from "../../../types/ActivityInterface";
import TeamsStandsParams from "./TeamsStandsParams";
import { ACTIVITY_API } from "../../../routes/api/activityRoutes";

interface ActivityFormProps {
  chosenActivityId: number | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ chosenActivityId }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [activityCreated, setActivityCreated] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  const [activityId, setActivityId] = useState<number | null>(null);

  const textTitle = activityCreated
    ? "Paramètres d'activité"
    : "Création d'une activité";
  const btnTextDisplay = activityCreated
    ? "Sauvegarder les paramètres"
    : "Créer l'activité";

  const initialActivityData: IActivityData = {
    name: "",
    activity_date: new Date(),
    activity_start_time: null,
    createdAt: new Date(), // Set to current date or another appropriate value
    global_duration: null,
    nb_participants: null,
    nb_teams: null,
    rotation_duration: null,
    stand_duration: null,
    status: "NOT_STARTED", // Default status, adjust as necessary
    team: [], // Initialize as an empty array or appropriate value
    pause_start_time: null,
    pause_duration: null,
  };

  useEffect(() => {
    console.log("Activité ID récupéré : ", chosenActivityId);
  }, []);

  const [activityData, setActivityData] =
    useState<IActivityData>(initialActivityData);

  const validateForm = () => {
    const isValid =
      activityData.name.trim() !== "" && activityData.activity_date !== null;
    setIsFormValid(isValid);
  };

  const handleInputChange = <T extends keyof IActivityData>(
    field: T,
    value: IActivityData[T]
  ) => {
    setError(false);
    setUserMessage(null);
    setActivityData((prev) => {
      const updatedData = { ...prev, [field]: value };
      validateForm();
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      setUserMessage("Veuillez remplir tous les champs requis.");
      return;
    }

    if (activityData) {
      // User ID comes from the Gamemaster
      const userId = 7;

      // Reformater les dates
      const formattedActivityData = {
        ...activityData,
        user: userId,
        activity_date: activityData.activity_date
          ? format(new Date(activityData.activity_date), "yyyy-MM-dd HH:mm:ss")
          : null,
        createdAt: activityData.createdAt
          ? format(new Date(activityData.createdAt), "yyyy-MM-dd HH:mm:ss")
          : format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedActivityData),
      };

      try {
        const response = await fetch(`${ACTIVITY_API.activities}/`, options);
        const responseData = await response.json(); // Parse the JSON response

        if (!response.ok) {
          setActivityCreated(false);
          setError(true);
          setUserMessage("Activité non créée: " + responseData.message);
          throw new Error(
            `HTTP error! status: ${response.status}, ${responseData.message}`
          );
        }

        if (response.status === 201) {
          setError(false);
          setActivityCreated(true);
          setUserMessage("Activité créée avec succès");

          console.log("Activité créée avec succès: ", responseData);
          setActivityId(responseData.id);
        }
      } catch (error) {
        setActivityCreated(false);
        console.error(`Failed to update activity: `, error);
        setUserMessage("Erreur lors de la requête: " + error);
        setError(true);
      }
    }
  };

  return (
    <form>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box sx={{ p: 2 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
            {textTitle}
          </Typography>

          {/* Grid wrapper for every elements */}
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {/* <Stopwatch/> 
                <ControlButtons /> */}
            </Grid>

            <Grid
              display="flex"
              justifyContent="space-between"
              width="100%"
              sx={{ mb: 2 }}
            >
              <Typography>Nom de l'activité</Typography>

              <TextField
                sx={{ width: 170 }}
                fullWidth
                value={activityData.name || ""}
                variant="outlined"
                required
                placeholder="Nom de l'activité"
                onChange={(event) =>
                  handleInputChange("name", event.target.value)
                }
              />
            </Grid>

            <Grid
              display="flex"
              justifyContent="space-between"
              width="100%"
              sx={{ mb: 2 }}
            >
              <Typography>Date de l'activité</Typography>

              <TextField
                sx={{ width: 170 }}
                fullWidth
                type="date"
                variant="outlined"
                placeholder="Filled"
                required
                value={
                  activityData.activity_date
                    ? activityData.activity_date.toISOString().substring(0, 10)
                    : ""
                }
                onChange={(event) =>
                  handleInputChange(
                    "activity_date",
                    event.target.value ? new Date(event.target.value) : null
                  )
                }
              />
            </Grid>

            {/* Container for Time params */}
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Gestion du temps (mn)
              </Typography>

              <Grid
                display="flex"
                justifyContent="space-between"
                width="100%"
                sx={{ mb: 2 }}
              >
                <Typography>Durée de l'activité </Typography>

                <TextField
                  type="number"
                  value={activityData?.global_duration || ""}
                  onChange={(event) =>
                    handleInputChange(
                      "global_duration",
                      parseInt(event.target.value) || null
                    )
                  }
                  inputProps={{
                    className: "input-number",
                    min: "0", // Minimum value
                    step: "1",
                  }}
                />
              </Grid>

              <Grid
                display="flex"
                justifyContent="space-between"
                width="100%"
                sx={{ mb: 2 }}
              >
                <Typography>Durée de rotation </Typography>

                <TextField
                  type="number"
                  value={activityData?.rotation_duration || ""}
                  onChange={(event) =>
                    handleInputChange(
                      "rotation_duration",
                      parseInt(event.target.value) || null
                    )
                  }
                  inputProps={{
                    className: "input-number",
                    min: "0", // Minimum value
                    step: "1",
                  }}
                />
              </Grid>

              <Grid display="flex" justifyContent="space-between" width="100%">
                <Typography>Durée par stand</Typography>

                <TextField
                  type="number"
                  value={activityData?.stand_duration || ""}
                  onChange={(event) =>
                    handleInputChange(
                      "stand_duration",
                      parseInt(event.target.value) || null
                    )
                  }
                  inputProps={{
                    className: "input-number",
                    min: "0", // Minimum value
                    step: "1",
                  }}
                />
              </Grid>
            </Grid>
            {/* END Container for Time params */}

            {/* {activityCreated && <TeamsStandsParams activityId={activityId} />} */}
            {<TeamsStandsParams activityId={activityId} />}

            {/* Container for Params save */}
            <Grid
              display="flex"
              flexDirection="column"
              justifyContent="center"
              width="100%"
            >
              {userMessage && (
                <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
                  {userMessage}
                </Alert>
              )}
              <Button
                variant="contained"
                sx={{ minWidth: "auto", marginTop: 2 }}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                {btnTextDisplay}
              </Button>
            </Grid>

            {/* END Grid wrapper for every elements */}
          </Grid>
        </Box>
      </Container>
    </form>
  );
};

export default ActivityForm;
