import { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { STANDS_API } from "../../routes/api/standRoutes";
import useFetch from "../../hooks/useFetch";
import { ACTIVITY_API } from "../../routes/api/activityRoutes";
import themedTeamsNames from "../../utils/themedTeamsNames";
import CloseIcon from "@mui/icons-material/Close";

interface IStand {
  id: number;
  name: string;
  is_competitive: boolean;
  animator: string | null;
  activity: {
    id: number;
  };
}

interface ISelectedValue {
  id: number;
  name: string;
}

interface ITeamsStandsParamsProps {
  activityId: number | null;
}
const TeamsStandsParams: React.FC<ITeamsStandsParamsProps> = ({
  activityId,
}) => {
  // Number of teams selected
  const [numberOfTeams, setNumberOfTeams] = useState<number | null>(null);
  // Theme for teams name
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  // teams list
  const [teamList, setTeamList] = useState<string[]>([]);

  const [userMessageTeams, setUserMessageTeams] = useState<string | null>(null);

  const [stands, setStands] = useState<IStand[]>([]);
  const [selectedStands, setSelectedStands] = useState<ISelectedValue[]>([]);
  const [fetchedStandsData, standsLoading] = useFetch<IStand[]>(
    STANDS_API.stands
  );

  const categories = Object.keys(themedTeamsNames);

  useEffect(() => {
    if (Array.isArray(fetchedStandsData)) {
      setStands(fetchedStandsData);
    } else {
      setStands([]);
    }
  }, [fetchedStandsData]);

  const handleRemoveTeam = (indexToRemove: number) => {
    const newTeamList = teamList.filter((_, index) => index !== indexToRemove);
    setTeamList(newTeamList);
  };

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: IStand[] | null
  ) => {
    const newStands = value
      ? value.map((stand) => ({ id: stand.id, name: stand.name }))
      : [];
    setSelectedStands(newStands);
  };

  useEffect(() => {
    console.log(teamList)

  }, [teamList])
  
  // Use useEffect to react to changes in selectedStands
  useEffect(() => {
    if (selectedStands.length > 0) {
      prepareDataForDB(selectedStands);
    }
  }, [selectedStands]);

  // Assuming ISelectedValue is correctly defined to match the structure you need
  const prepareDataForDB = (stands: ISelectedValue[]) => {
    // This conversion might be redundant if it's already in the correct format
    const dataToSave = stands.map((stand) => ({
      id: stand.id,
      name: stand.name,
    }));

    const jsonData = JSON.stringify(dataToSave);
    // console.log(jsonData);
    handleSubmit(jsonData);
  };

  const handleSubmit = async (jsonData: string) => {
    try {
      const payload = {
        stands: JSON.parse(jsonData), // parse it back into an array to fit the expected structure
      };
      const response = await fetch(`${ACTIVITY_API.activities}/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit data");
      console.log("Data submitted successfully");
      // Additional UI update logic can go here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const generateTeamNames = () => {
    if (!selectedTheme) {
      setUserMessageTeams("Merci de choisir un thème");
      return;
    }

    if (!numberOfTeams) {
      setUserMessageTeams("Merci de choisir un nombre d'équipes");
      return;
    }
    setUserMessageTeams(null);
    const names = themedTeamsNames[selectedTheme || ""];
    const shuffledNames = names.sort(() => 0.5 - Math.random());
    numberOfTeams && setTeamList(shuffledNames.slice(0, numberOfTeams));
  };

  const handleThemeChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setSelectedTheme(value);
    setUserMessageTeams(null);
  };

  return (
    <>
      {/* Container for Stands params */}
      <Grid container>
        <Typography variant="h6" component="h2" gutterBottom>
          Gestion des stands
        </Typography>
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
            fullWidth
            multiple
            getOptionLabel={(option) => option.name}
            onChange={handleChange}
            loading={standsLoading}
            loadingText="Chargement..."
            noOptionsText="Aucune option"

            renderInput={(params) => (
              <TextField {...params} label="Choisir ou créer des stands " />
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
          <Typography sx={{ mb: 2 }}>Nombre d'équipes</Typography>
          <TextField
            type="number"
            inputProps={{
              className: "input-number",
              min: "0", // Minimum value
              step: "1",
            }}
            onChange={(event) =>
              setNumberOfTeams(parseInt(event.target.value, 10))
            }
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
            id="theme-autocomplete"
            options={categories}
            getOptionLabel={(option) => option}
            onChange={handleThemeChange}
            renderInput={(params) => (
              <TextField {...params} label="Choisir un thème" />
            )}
          />
          {userMessageTeams && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {userMessageTeams}
            </Alert>
          )}
          <Button
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 300 }}
            onClick={generateTeamNames}
          >
            Générer la liste des équipes
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Liste des équipes
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {teamList.map((team, index) => (
              <Box
                key={index}
                bgcolor="primary.main"
                color="primary.contrastText"
                p={1}
                borderRadius={1}
              >
                Équipe {team}
                <IconButton
                  onClick={() => handleRemoveTeam(index)}
                  size="small"
                  sx={{ color: "grey.200" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
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
