import { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { ActivityContext } from "../contexts/ActivityContext";
import { IActivityData } from "../types/activityTypes";
import NavbarUp from "../components/NavbarUp";
import ControlButtons from "../components/Timer/ControlButtons";
import Stopwatch from "../components/Timer/Stopwatch";

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

  const stands: string[] = [];

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
        <Container component="main" maxWidth="sm">
          <Box sx={{ p: 2 }}>
            <Typography component="h1" variant="h4" align="center">
              Paramètres d'activité
            </Typography>

            {/* Grid wrapper for every elements */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stopwatch/> 
                <ControlButtons />
              </Grid>

              <Grid display="flex" justifyContent="space-between" width="100%">
                <Typography>Nom de l'activité</Typography>

                <Typography>{activityName}</Typography>
              </Grid>

              <Grid display="flex" justifyContent="space-between" width="100%">
                <Typography>Date de l'activité</Typography>

                <TextField
                  sx={{ width: 145 }}
                  fullWidth
                  type="date"
                  variant="outlined"
                  placeholder="Filled"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </Grid>

              {/* Container for Time params */}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  Gestion du temps (mn)
                </Typography>

                <Grid
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography>Durée de l'activité </Typography>

                  <TextField
                    type="number"
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
                >
                  <Typography>Durée de rotation </Typography>

                  <TextField
                    type="number"
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
                >
                  <Typography>Durée par stand</Typography>

                  <TextField
                    type="number"
                    inputProps={{
                      className: "input-number",
                      min: "0", // Minimum value
                      step: "1",
                    }}
                  />
                </Grid>
              </Grid>
              {/* END Container for Time params */}

              {/* Container for Stands params */}
              <Grid container>
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
              {/* END Container for Stands params */}

              {/* Container for Teams params */}
              <Grid container>
                <Typography variant="h6" component="h2" gutterBottom>
                  Gestion des équipes
                </Typography>
                <Grid
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography>Nombre d'équipes</Typography>

                  <TextField
                    type="number"
                    inputProps={{
                      className: "input-number",
                      min: "0", // Minimum value
                      step: "1",
                    }}
                  />
                </Grid>

                <Grid
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  width="100%"
                >
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
                      <TextField {...params} label="Thème du nom équipe ?" />
                    )}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ minWidth: 300 }}
                  >
                    Générer la liste des équipes
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Liste des équipes (a générer dynamiquement)
                  </Typography>
                  <span>Equipe 1</span>
                  <span>Equipe 2</span>
                  <span>Equipe 3...</span>
                </Grid>
                <Grid
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  width="100%"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ minWidth: 300 }}
                  >
                    Attribuer les équipes au stands
                  </Button>
                </Grid>
              </Grid>
              {/* END Container for Teams params */}

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
                >
                  Sauvegarder l'activité
                </Button>
              </Grid>

              {/* END Grid wrapper for every elements */}
            </Grid>
          </Box>
        </Container>
      </form>
    </>
  );
};

export default Gamemaster;
