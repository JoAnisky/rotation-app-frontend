import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
// import { useState } from "react";

const TeamsStandsParams = () => {
//   const [value, setValue] = useState<number | null>(null);
  const stands: string[] = [];

  return (
    <>
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
              <TextField {...params} label="Chercher ou créer un stand ?" />
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
        <Grid display="flex" justifyContent="space-between" width="100%">
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
          <Button variant="outlined" color="secondary" sx={{ minWidth: 300 }}>
            Générer la liste des équipes
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>Liste des équipes (a générer dynamiquement)</Typography>
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
          <Button variant="outlined" color="secondary" sx={{ minWidth: 300 }}>
            Attribuer les équipes au stands
          </Button>
        </Grid>
      </Grid>
      {/* END Container for Teams params */}
    </>
  );
};

export default TeamsStandsParams;
