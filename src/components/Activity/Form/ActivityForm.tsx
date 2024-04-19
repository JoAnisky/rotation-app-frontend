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
import useFetch from "../../../hooks/useFetch";
import { SnackMessage } from "../../../types/SnackbarTypes";
import CustomSnackbar from "../../CustomSnackbar";

interface ActivityFormProps {
  chosenActivityId: number | string | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ chosenActivityId }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // State for open custom snackbar message
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // State for manage SnackBar message and color (severity)
  const [snackMessageSeverity, setSnackMessageSeverity] =
    useState<SnackMessage>({
      message: "",
      severity: "success", // Default severity is 'success'
    });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [activityData, setActivityData] = useState<IActivityData>({
    name: "",
    activity_date: new Date(),
    createdAt: new Date(),
    status: "NOT_STARTED",
    global_duration: null,
    rotation_duration: null,
    stand_duration: null,
    nb_teams: null,
    nb_participants: null,
    team: [],
    activity_start_time: null,
    pause_start_time: null,
    pause_duration: null,
  });

  // Get activity params
  const [
    fetchedActivityData,
    fetchedActivityDataLoading,
    fetchedActivityError,
  ] = useFetch<IActivityData>(ACTIVITY_API.activityById(chosenActivityId));

  useEffect(() => {
    if (fetchedActivityData) {
      setActivityData((prev) => ({
        ...prev,
        ...fetchedActivityData,
        activity_date: fetchedActivityData.activity_date
          ? new Date(fetchedActivityData.activity_date)
          : null,
      }));
    }
    console.log(fetchedActivityData);
  }, [fetchedActivityData]);

  const handleInputChange = <T extends keyof IActivityData>(
    field: T,
    value: IActivityData[T]
  ) => {
    setActivityData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const isValid =
      activityData.name.trim() !== "" && Boolean(activityData.activity_date);
    setIsFormValid(isValid);
  }, [activityData.name, activityData.activity_date]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      setSnackbarOpen(true);
      setSnackMessageSeverity({
        message: "Veuillez remplir les champs Nom et Date d'activité",
        severity: "error",
      });
      return;
    }

    if (activityData) {
      // Reformater les dates
      const formattedActivityData = {
        ...activityData,
        activity_date: activityData.activity_date
          ? format(new Date(activityData.activity_date), "yyyy-MM-dd HH:mm:ss")
          : null,
        createdAt: activityData.createdAt
          ? format(new Date(activityData.createdAt), "yyyy-MM-dd HH:mm:ss")
          : format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedActivityData),
      };

      try {
        const response = await fetch(
          ACTIVITY_API.activityById(chosenActivityId),
          options
        );
        if (!response.ok) {
          const errorText = await response.text(); // Safely read the raw text
          setSnackbarOpen(true);
          setSnackMessageSeverity({
            message: errorText,
            severity: "error",
          });
          throw new Error(
            `HTTP error! status: ${response.status}, ${errorText}`
          );
        }

        setSnackbarOpen(true);
        setSnackMessageSeverity({
          message: "Activité mise à jour avec succès",
          severity: "success",
        });
      } catch (error) {
        console.error(`Failed to update activity: `, error);
        setSnackbarOpen(true);
        setSnackMessageSeverity({
          message: "Erreur lors de la mise a jour : ",
          error,
          severity: "error",
        });
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 2 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
          Paramètres d'activité
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
              sx={{ width: 210 }}
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
              sx={{ width: 210 }}
              fullWidth
              type="date"
              variant="outlined"
              required
              value={
                activityData.activity_date
                  ? format(activityData.activity_date, "yyyy-MM-dd")
                  : ""
              }
              onChange={(event) => {
                const dateValue = event.target.value
                  ? new Date(event.target.value)
                  : null;
                handleInputChange("activity_date", dateValue);
              }}
            />
          </Grid>

          {/* Container for Time params */}
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
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

          {<TeamsStandsParams activityId={chosenActivityId} />}

          {/* Container for Params save */}
          <Grid
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width="100%"
          >
            <Button
              variant="contained"
              sx={{ minWidth: "auto", marginTop: 2 }}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Sauvegarder les paramètres
            </Button>
          </Grid>

          {/* END Grid wrapper for every elements */}
        </Grid>
        <CustomSnackbar
          open={snackbarOpen}
          handleClose={handleCloseSnackbar}
          message={snackMessageSeverity.message}
          severity={snackMessageSeverity.severity} // Optional: error, warning, info, success
        />
      </Box>
    </Container>
  );
};

export default ActivityForm;
