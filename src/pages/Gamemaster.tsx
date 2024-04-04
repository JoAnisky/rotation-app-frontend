import PageContainer from "../layouts/PageContainer";
// import ControlButtons from "../components/Timer/ControlButtons";
import StopWatch from "../components/Timer/Stopwatch";
import { ActivityContext } from "../contexts/ActivityContext";
import { useContext, useEffect, useState } from "react";
import { IActivityData } from "../types/activityTypes";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import NavbarUp from "../components/NavbarUp";

interface IPageContainerProps {
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
}

const Gamemaster: React.FC<IPageContainerProps> = ({
  handleChangeSelection,
}) => {
  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [activityName, setActivityName] = useState<string>("");
  const [value, setValue] = useState<number | null>(null);
  const stands = {};
  // Get ActivityData
  const activityDataProvider = useContext(ActivityContext);

  // Retrieve current activity data
  useEffect(() => {
    if (activityDataProvider) {
      setActivityData(activityDataProvider);
      setActivityName(activityDataProvider.name);
    } else {
      // still loading or null ??
    }
  }, [activityDataProvider]);

  return (
    <>
      <NavbarUp
        role={"Maitre du jeu"}
        handleChangeSelection={() => handleChangeSelection?.()}
        animatorStandSetted={false}
      />
      <form>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Paramètres de l'activité
            </Typography>
            <Box sx={{ my: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StopWatch isAdmin={true} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Gestion de l'activité
                  </Typography>
                  <Typography>Nom : {activityName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Date de l'activité</Typography>
                  <TextField
                  fullWidth
                    type="date"
                    variant="outlined"
                    placeholder="Filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Gestion du temps
                  </Typography>
                  <Grid item xs={12} sm={6}>
                    <Typography>Durée de l'activité</Typography>

                    <TextField
                    fullWidth
                      inputProps={{
                        className: "input-number",
                        type: "number",
                        min: "0", // Minimum value
                        step: "1",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Durée de rotation</Typography>

                    <TextField
                      inputProps={{
                        className: "input-number",
                        type: "number",
                        min: "0", // Minimum value
                        step: "1",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Durée par stand</Typography>

                    <TextField
                      inputProps={{
                        className: "input-number",
                        type: "number",
                        min: "0", // Minimum value
                        step: "1",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Gestion des stands
                  </Typography>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      id="stand-autocomplete"
                      options={stands}
                      // getOptionLabel={(option) => option.name}
                      // onChange={(event, value: IStand | null) => {
                      //   setSelectedStand(
                      //     value ? { id: value.id, name: value.name } : null
                      //   );
                      // }}
                      // loading={standsLoading}
                      loadingText="Chargement..."
                      noOptionsText="Aucune option"
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chercher ou créer un stand ?"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Gestion des équipes
                </Typography>
                <Grid item xs={12}>
                  <Typography>Nombre d'équipes</Typography>

                  <TextField
                    inputProps={{
                      className: "input-number",
                      type: "number",
                      min: "0", // Minimum value
                      step: "1",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="stand-autocomplete"
                    options={stands}
                    // getOptionLabel={(option) => option.name}
                    // onChange={(event, value: IStand | null) => {
                    //   setSelectedStand(
                    //     value ? { id: value.id, name: value.name } : null
                    //   );
                    // }}
                    // loading={standsLoading}
                    loadingText="Chargement..."
                    noOptionsText="Aucune option"
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Nom de l'équipe ?" />
                    )}
                  />
                  <Button variant="outlined" color="secondary"sx={{ minWidth: 300 }}>
                    Générer la liste des équipes
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Liste des équipes</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" color="secondary" sx={{ minWidth: 300 }}>
                    Attribuer les équipes au stands
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" sx={{ minWidth: 300, marginTop: 2 }}>
                    Sauvegarder l'activité
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </form>
    </>
  );
};

export default Gamemaster;
