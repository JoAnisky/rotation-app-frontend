import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  Switch,
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
interface ToggleStates {
  [key: number]: boolean;
}

interface ISelectedValue {
  id: number;
  name: string;
  isCompetitive?: boolean;
}

interface ITeamsStandsParamsProps {
  activityId: number | null;
}
type FieldType = "stands" | "teams"; // This is now a type alias for use directly as a type

const TeamsStandsParams: React.FC<ITeamsStandsParamsProps> = ({
  activityId,
}) => {
  // Number of teams selected
  const [numberOfTeams, setNumberOfTeams] = useState<number | null>(null);
  // Theme for teams name
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  // teams list
  const [teamList, setTeamList] = useState<ISelectedValue[]>([]);

  // Prevent PUT request with empty teams and stands array on component mount
  const hasStandsBeenSent = useRef(false); // Tracks if stands data has been sent at least once after mount
  const hasTeamsBeenSent = useRef(false); // Tracks if teams data has been sent at least once after mount

  // User message
  const [userMessageTeams, setUserMessageTeams] = useState<string | null>(null);

  const [stands, setStands] = useState<IStand[]>([]);
  const [selectedStands, setSelectedStands] = useState<ISelectedValue[]>([]);
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});

  // Stands for user selection fetched from : All Stand entries
  const [fetchedStandsData, standsLoading] = useFetch<IStand[]>(
    STANDS_API.stands
  );

  // Get all themedTeamsNames indexes
  const categories = Object.keys(themedTeamsNames);
  // Replace all "_" in categories names with empty space and sort category by name
  const formattedCategories = categories
    .map(
      (category) => category.replace(/_/g, " ") // This replaces all underscores in the string
    )
    .sort();

  // Sets Stands for user selection
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

  // Handler to update toggle state
  const handleToggleCompetitive = (id: number, checked: boolean): void => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: checked,
    }));
    const standToToggleIndex = selectedStands.findIndex(
      (stand) => stand.id === id
    );
    // Perform a safety check to ensure the stand was found
    if (standToToggleIndex !== -1) {
      // Get the stand to toggle
      const standToToggle = selectedStands[standToToggleIndex];

      // Create a new copy of the stand with the updated isCompetitive property
      const updatedStand = {
        ...standToToggle,
        isCompetitive: checked,
      };

      // Create a new array for the stands that includes this updated stand
      const updatedStands = [
        ...selectedStands.slice(0, standToToggleIndex),
        updatedStand,
        ...selectedStands.slice(standToToggleIndex + 1),
      ];

      // Set the updated stands array back to the state
      setSelectedStands(updatedStands);
    } else {
      console.error("Stand not found with ID:", id);
    }
  };

  // Make sure to update the toggle state when a stand is removed
  const handleRemoveStand = (idToRemove: number, indexToRemove: number) => {
    const removedStandIndex = selectedStands.findIndex(
      (stand) => stand.id === idToRemove
    );
    if (removedStandIndex !== -1) {
      const removedStand = selectedStands[removedStandIndex];

      const newStandList = selectedStands.filter(
        (_, index) => index !== removedStandIndex
      );

      setSelectedStands(newStandList);

      const newToggleStates = { ...toggleStates };
      delete newToggleStates[removedStand.id];
      setToggleStates(newToggleStates);
    } else {
      console.error("Invalid index to remove:", indexToRemove);
    }
  };

  const handleStandSelection = (
    event: React.SyntheticEvent<Element, Event>,
    value: ISelectedValue[] | ISelectedValue | null
  ) => {
    let newStands: ISelectedValue[] = [];

    if (Array.isArray(value)) {
      newStands = value.map((stand) => ({
        id: stand.id,
        name: stand.name,
        isCompetitive: stand.isCompetitive ?? false,
      }));
    } else if (value) {
      // Check if value is not null or undefined
      newStands = [
        {
          id: value.id,
          name: value.name,
          isCompetitive: value.isCompetitive ?? false,
        },
      ]; // Wrap single object into an array
    } else {
      newStands = [];
    }

    setSelectedStands(newStands);
  };

  // General method to prepare and send data to the DB
  const prepareAndSendData = (dataList: ISelectedValue[], type: FieldType) => {
    const dataToSave = dataList.map((data) => ({
      id: data.id,
      name: data.name,
      isCompetitive: data.isCompetitive,
    }));
    const jsonData = JSON.stringify(dataToSave);

    const hasBeenSentRef =
      type === "stands" ? hasStandsBeenSent : hasTeamsBeenSent;

    // Condition to send data: Non-empty data or previously sent data now empty
    if (jsonData !== "[]" || (jsonData === "[]" && hasBeenSentRef.current)) {
      sendDataToDB(jsonData, type);
      hasBeenSentRef.current = true; // Mark that data has been sent
    }
  };

  // React to changes in selectedStands
  useEffect(() => {
    prepareAndSendData(selectedStands, "stands");
  }, [selectedStands]);

  // React to changes in teamList
  useEffect(() => {
    prepareAndSendData(teamList, "teams");
  }, [teamList]);

  const sendDataToDB = async (jsonData: string, dataField: FieldType) => {
    try {
      // Construct payload dynamically based on the dataField
      const payload = {
        [dataField]: JSON.parse(jsonData),
      };
      const response = await fetch(`${ACTIVITY_API.activities}/${27}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit data");
      console.log("Data submitted successfully for", dataField);
      // Additional UI update logic can go here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  /**
   * Generate random teams name using ThemeList "utils/themedTeamsNames.ts"
   * @returns void
   */
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

    // Retrieve the list of potential team names based on the selected theme
    const names = themedTeamsNames[selectedTheme || ""];

    // Shuffle the names to randomize team assignments
    const shuffledNames = names.sort(() => 0.5 - Math.random());

    // Slice the array to get only the number of teams needed
    const selectedNames = shuffledNames.slice(0, numberOfTeams);

    // Create an array of objects with id and name for each team
    const teamObjects = selectedNames.map((name, index) => ({
      id: index, // Assigning a temporary ID based on the index
      name: name,
    }));

    // Update the team list state with the new team objects
    setTeamList(teamObjects);
  };

  /**
   * Gets selected theme for teams name
   * @param event
   * @param value
   */
  const handleThemeChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setSelectedTheme(value);
    setUserMessageTeams(null);
  };

  const handleGetScenario = () => {
    // here verify teams and stands params
    // If params are ok, set to generateScenario method
    generateScenario();
  };

  const generateScenario = async () => {
    try {
      const response = await fetch(
        `${ACTIVITY_API.activities}/${27}/generate_scenario`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to generate scenario");

      // Additional UI update logic can go here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      {/* Container for Stands params */}
      <Grid container>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
          Gestion des stands
        </Typography>
        <Grid
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
          sx={{ mb: 2 }}
        >
          <Autocomplete
            multiple
            disablePortal
            value={selectedStands}
            id="stand-autocomplete"
            options={stands}
            fullWidth
            sx={{ mb: 2 }}
            getOptionLabel={(option) => option.name}
            onChange={handleStandSelection}
            loading={standsLoading}
            loadingText="Chargement..."
            noOptionsText="Aucune option"
            renderInput={(params) => (
              <TextField {...params} label="Choisir ou créer des stands " />
            )}
          />
          {/* Display selected stands if not empty*/}
          {selectedStands.length > 0 && ""}
          <Box display="flex" flexWrap="wrap" gap={2}>
            {selectedStands.map((stand, index) => (
              <Box
                key={stand.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="primary.main"
                color="primary.contrastText"
                p={1}
                borderRadius={1}
                width={1}
              >
                Stand {stand.name}
                <div style={{ marginLeft: "auto" }}>
                  Competitif
                  <Switch
                    checked={toggleStates[stand.id] || false}
                    onChange={(e) =>
                      handleToggleCompetitive(stand.id, e.target.checked)
                    }
                    name="isCompetitive"
                    color="default"
                  />
                  <IconButton
                    onClick={() => handleRemoveStand(stand.id, index)}
                    size="small"
                    sx={{ color: "grey.200" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      {/* END Container for Stands params */}

      {/* Container for Teams params */}
      <Grid container>
        <Typography variant="h6" component="h2" gutterBottom>
          Gestion des équipes
        </Typography>
        <Grid display="flex" justifyContent="space-between" width="100%">
          <Typography sx={{ mb: 4 }}>Nombre d'équipes</Typography>
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
            options={formattedCategories}
            sx={{ mb: 2 }}
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
          {/* Display Team list if teamList is not empty*/}
          {teamList.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
              {teamList.map((team, index) => (
                <Box
                  key={index}
                  bgcolor="primary.main"
                  color="primary.contrastText"
                  p={1}
                  borderRadius={1}
                >
                  Équipe {team.name}
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
          )}
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
            onClick={handleGetScenario}
          >
            Attribuer les équipes au stands
          </Button>
        </Grid>
      </Grid>
      {/* END Container for Teams params */}
    </>
  );
};

export default TeamsStandsParams;
