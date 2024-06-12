import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Checkbox, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFetch, useAuth } from "@/hooks";
import themedTeamsNames from "@/utils/themedTeamsNames";
import CustomSnackbar from "@/components/CustomSnackbar";
import { ACTIVITY_API, SCENARIO_API, STANDS_API } from "@/routes/api/";
import { CustomSnackbarMethods, Severity } from "@/types/SnackbarTypes";
import { IStand, ITeam } from "@/types/ActivityInterface";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

interface ITeamStandsParamsProps {
  activityId: number | string;
  standsList: IStand[] | null;
  teamsList: ITeam[] | null;
  numberOfTeamsStored: number | null;
}

type FieldType = "stands" | "teams" | "nb_teams"; // Datatype corresponding to DB fields to update

// To keep track of the number of teams on each stand if needed for other operations or UI logic
interface INbTeamsOnStand {
  [key: number]: number; // Maps stand ID to numberOfTeamsOnStand
}
const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const TeamsStandsParams: React.FC<ITeamStandsParamsProps> = ({
  activityId,
  standsList,
  teamsList,
  numberOfTeamsStored
}) => {
  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  // Number of teams selected
  const [numberOfTeams, setNumberOfTeams] = useState<number>(0);

  // Theme for teams name
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  // teams list
  const [teamList, setTeamList] = useState<ITeam[]>([]);

  // Stands for user selection fetched from : All Stand entries
  const [fetchedStandsData, standsLoading] = useFetch<IStand[]>(STANDS_API.stands);
  const [stands, setStands] = useState<IStand[]>([]);

  // Stands added to stnad list by user selection
  const [selectedStands, setSelectedStands] = useState<IStand[]>([]);
  const [nbTeamsOnStand, setNbTeamsOnStand] = useState<INbTeamsOnStand>({});

  // Prevent PUT request with empty teams and stands array on component mount
  const hasStandsBeenSent = useRef<boolean>(false); // Tracks if stands data has been sent at least once after mount
  const hasTeamsBeenSent = useRef<boolean>(false); // Tracks if teams data has been sent at least once after mount

  // Get all themedTeamsNames indexes
  const categories = Object.keys(themedTeamsNames);
  // Replace all "_" in categories names with empty space and sort category by name
  const formattedCategories = categories.map(category => category.replace(/_/g, " ")).sort(); // This replaces all underscores in the string

  const auth = useAuth();
  const { csrfToken } = auth;

  // Sets Stands for user selection
  useEffect(() => {
    if (Array.isArray(fetchedStandsData)) {
      setStands(fetchedStandsData);
    }
  }, [fetchedStandsData]);

  useEffect(() => {
    selectedTheme && generateTeamNames(numberOfTeams, selectedTheme);
    // eslint-disable-next-line
  }, [selectedTheme]);

  useEffect(() => {
    // If selected standList change
    prepareAndSendData(selectedStands, "stands");
    // eslint-disable-next-line
  }, [selectedStands]);

  useEffect(() => {
    // If selected teamList change
    prepareAndSendData(teamList, "teams");
    // eslint-disable-next-line
  }, [teamList]);

  useEffect(() => {
    if (standsList) {
      // For nbTeamsOnStand on component mount
      const newNbTeamsOnStand = standsList.reduce<INbTeamsOnStand>((acc, stand) => {
        // Use nbTeamsOnStand on stand if available, otherwise initalize 0
        acc[stand.id] = stand.nbTeamsOnStand || 0;
        return acc;
      }, {});

      // update
      setNbTeamsOnStand(newNbTeamsOnStand);
      setSelectedStands(standsList);
    }
  }, [standsList]);

  // useEffect for managing the teams data
  useEffect(() => {
    // Check if the teamsList prop is available
    if (teamsList) {
      // If teamsList is provided, update the local state 'setTeamList' with this data.
      // teams data is fetched from the database and passed to this component
      setTeamList(teamsList);
    }
  }, [teamsList]);

  // useEffect for managing the numberOfTeams data
  useEffect(() => {
    // Check if the numberOfTeamsStored prop is available
    if (numberOfTeamsStored) {
      // If numberOfTeamsStored is provided, update the local state 'setNumberOfTeams' with this data.
      // numberOfTeamsStored data is fetched from the database and passed to this component
      setNumberOfTeams(numberOfTeamsStored);
    }
  }, [numberOfTeamsStored]);

  /**
   * Handle selected stand
   * @param _event
   * @param value
   * @returns void
   */
  const handleStandSelection = (_event: React.SyntheticEvent, value: IStand[] | IStand | null): void => {
    let newStands: IStand[] = [];

    if (Array.isArray(value)) {
      newStands = value;
    } else if (value) {
      newStands = [value];
    }
    setSelectedStands(newStands);
    newStands.forEach(stand => {
      if (nbTeamsOnStand[stand.id] === undefined) {
        setNbTeamsOnStand(prev => ({ ...prev, [stand.id]: 0 })); // initialise si non défini
      }
    });
  };

  /**
   * Handle the number of teams on stand
   * @param id Stand to update
   * @param numberTeam number of teams on the stand
   * @returns
   */
  const handleNbTeamsOnStand = (id: number, numberTeam: number): void => {
    setNbTeamsOnStand(prev => ({
      ...prev,
      [id]: numberTeam
    }));

    const standToUpdateIndex = selectedStands.findIndex(stand => stand.id === id);
    // Perform a safety check to ensure the stand was found
    if (standToUpdateIndex !== -1) {
      // Get the stand to toggle
      const standToUpdate = selectedStands[standToUpdateIndex];

      // Create a new copy of the stand with the updated nb teams on stand property
      const updatedStand = {
        ...standToUpdate,
        nbTeamsOnStand: numberTeam
      };

      // Create a new array for the stands that includes this updated stand
      const updatedStands = [
        ...selectedStands.slice(0, standToUpdateIndex),
        updatedStand,
        ...selectedStands.slice(standToUpdateIndex + 1)
      ];

      // Set the updated stands array back to the state
      setSelectedStands(updatedStands);
    } else {
      console.error("Stand not found with ID:", id);
    }
  };

  /**
   * Remove a stand from selectedStands + update the numberOfteams on stand state when a stand is removed
   * @param idToRemove Stand to remove
   * @returns void
   */
  const handleRemoveStand = (idToRemove: number): void => {
    const updatedStands = selectedStands.filter(stand => stand.id !== idToRemove);
    setSelectedStands(updatedStands);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [idToRemove]: _, ...remainingTeams } = nbTeamsOnStand; // remove entry for deleted stand
    setNbTeamsOnStand(remainingTeams);
  };

  /**
   * Generate random teams name using ThemeList "utils/themedTeamsNames.ts"
   * @returns void
   */
  const generateTeamNames = (numberOfTeams: number, theme: string): void => {
    // Immediate return if the theme or number of teams is not initialized properly
    if (!theme || numberOfTeams === null) {
      console.log("Initialization check - Skipping execution");
      return;
    }

    if (numberOfTeams > 0 && !theme) {
      snackbarRef.current?.showSnackbar("Il faudrait choisir un thème", "warning");
      return;
    }

    if (!numberOfTeams && theme) {
      // Check to avoid triggering this message on mount:
      if (theme !== "") {
        setTeamList([]);
        snackbarRef.current?.showSnackbar("Il faudrait choisir un nombre d'équipes", "warning");
      }
      return;
    }

    // Replace spaces with underscores in a theme
    const formattedTheme = theme.replace(/ /g, "_");

    // Retrieve the list of potential team names based on the selected theme
    const names = themedTeamsNames[formattedTheme] || []; // Safe fallback to prevent errors if theme is undefined

    // Shuffle and slice the array as before
    const shuffledNames = names.sort(() => 0.5 - Math.random());
    const selectedNames = shuffledNames.slice(0, numberOfTeams);

    const teamObjects = selectedNames.map((teamName, index) => ({
      teamId: index,
      teamName
    }));

    setTeamList(teamObjects);
  };

  /**
   * Gets selected theme for teams name
   * @param event
   * @param value Selected theme
   */
  const handleThemeChange = (_event: React.SyntheticEvent<Element, Event>, value: string | null): void => {
    setSelectedTheme(value);
  };

  /**
   *
   * @param indexToRemove Team ID to remove
   * @returns void
   */
  const handleRemoveTeam = (indexToRemove: number): void => {
    const newTeamList = teamList.filter((_, index) => index !== indexToRemove);
    setTeamList(newTeamList);
    setNumberOfTeams(prev => prev - 1);
  };

  /**
   * General method to prepare and send data to the DB
   * @param dataList Data to update
   * @param fieldType field to update
   */
  const prepareAndSendData = (dataList: (IStand | ITeam)[], fieldType: FieldType) => {
    let dataToSave;

    if (fieldType === "teams") {
      // Count teams only if dataList is not empty to prevent zeroing out on initial load
      if (dataList.length > 0) {
        sendDataToDB(JSON.stringify(numberOfTeams), "nb_teams");
      }

      dataToSave = dataList.map(item => {
        if ("teamId" in item) {
          const team = item as ITeam;
          // Si c'est une équipe, retournez une structure de données avec les propriétés de l'équipe
          return {
            teamId: team.teamId,
            teamName: team.teamName
          };
        }
      });
      // Check if data is not empty or has been sent once already
      if (dataToSave.length > 0 || hasTeamsBeenSent.current) {
        sendDataToDB(JSON.stringify(dataToSave), fieldType);
        hasTeamsBeenSent.current = true; // Mark that data has been sent
      }
    } else {
      // Similar logic applied for stands
      dataToSave = dataList.map(item => {
        // Type guard to check if item is IStand
        if ("nbTeamsOnStand" in item) {
          // Safe to access nbTeamsOnStand

          return { id: item.id, name: item.name, nbTeamsOnStand: nbTeamsOnStand[item.id] || 1 };
        } else {
          // This case should theoretically never happen if data handling is correct
          // Default value or handle error
          return { id: item.teamId, name: item.teamName, nbTeamsOnStand: 1 };
        }
      });

      if (dataToSave.length > 0 || hasStandsBeenSent.current) {
        sendDataToDB(JSON.stringify(dataToSave), fieldType);
        hasStandsBeenSent.current = true; // Mark that data has been sent
      }
    }
  };

  /**
   * Send data to db using field name
   * @param jsonData Data to send
   * @param dataField Field name to update
   */
  const sendDataToDB = async (jsonData: string, dataField: FieldType): Promise<void> => {
    try {
      // Construct payload dynamically based on the dataField
      const payload = {
        [dataField]: JSON.parse(jsonData)
      };
      const response = await fetch(`${ACTIVITY_API.getActivityById(activityId)}`, {
        method: "PUT",
        headers: {
          "x-xsrf-token": csrfToken as string, // Utiliser le token CSRF ici
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to submit data");
      console.log("Data submitted successfully for", dataField);
      // Additional UI update logic can go here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  /**
   * Perform basic checks before sending request to generate Scenario
   * @return void
   */
  const handleGetScenario = (): void => {
    // Check if no teams/Stands have been selected (numberOfTeams/selectedStands.length should be greater than 0)
    if (numberOfTeams <= 0 || selectedStands.length === 0) {
      let errorMessage = "Il faudrait choisir ";
      if (numberOfTeams <= 0 && selectedStands.length === 0) {
        errorMessage += "les stands et les équipes.";
      } else if (numberOfTeams <= 0) {
        errorMessage += "un nombre d'équipes.";
      } else if (selectedStands.length === 0) {
        errorMessage += "au moins un stand.";
      }

      snackbarRef.current?.showSnackbar(errorMessage, "error");

      return; // Stop execution if the condition is not met
    }

    // If the conditions are met, proceed to generate the scenario
    generateScenario();
  };

  /**
   * Generate scenario and display error message to the user if an error occurs
   */
  const generateScenario = async () => {
    let severity: Severity = "success";
    let message = "Scenario généré avec succès"; // Default success message
    let details = " ";
    try {
      const response = await fetch(`${SCENARIO_API.getScenarioByActivityId(activityId)}/generate`, {
        method: "GET",
        headers: {
          "x-xsrf-token": csrfToken as string, // Utiliser le token CSRF ici
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      });
      const data = await response.json(); // Assuming the server responds with JSON
      details = data.details;
      if (!response.ok) {
        throw new Error(data.message || "Unknown error occurred");
      }

      // Optionally check the 'success' flag if it's included in the response
      if (data.success === false) {
        severity = "warning"; // Use 'warning' or 'error' based on your business logic
        message = data.message || "Il y'a un problème coté serveur.";
      } else {
        message = data.message || message; // Use the server-provided message or default message
        details = data.details;
      }
    } catch (error) {
      if (error instanceof Error) {
        // Now TypeScript knows `error` is an Error object, hence `message` property can be safely accessed.
        message = error.message + " : \n" + details || "An error occurred while processing your request.";
      } else {
        // If it's not an Error object, handle it differently or throw again
        message = "An unknown error occurred and it's not an instance of Error.";
      }
      console.error("Error submitting data:", error);
      severity = "error";
    }

    snackbarRef.current?.showSnackbar(message, severity);
  };

  return (
    <>
      {/* Container for Stands params */}
      <Grid container>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
          Gestion des stands
        </Typography>
        <Grid display="flex" flexDirection="column" justifyContent="center" width="100%" sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            disablePortal
            disableCloseOnSelect
            value={selectedStands}
            id="stand-autocomplete"
            options={stands}
            fullWidth
            sx={{ mb: 2 }}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id} // Customize the equality test
            onChange={handleStandSelection}
            loading={standsLoading}
            loadingText="Chargement..."
            noOptionsText="Aucune option"
            renderInput={params => <TextField {...params} label="Choisir ou créer des stands" />}
            renderOption={(props, option) => {
              const isSelected = selectedStands.some(stand => stand.id === option.id);
              return (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={isSelected} />
                  {option.name}
                </li>
              );
            }}
          />
          {/* Display selected stands if not empty*/}
          {selectedStands.length > 0 && ""}
          <Box display="flex" flexWrap="wrap" gap={2}>
            {selectedStands.map(stand => (
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
                {stand.name}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 1 }}>Nb d'équipes:</Typography>
                  <TextField
                    type="number"
                    value={nbTeamsOnStand[stand.id] || 1}
                    onChange={e => handleNbTeamsOnStand(stand.id, parseInt(e.target.value, 10))}
                    inputProps={{ min: 1, max: 5 }}
                    sx={{
                      width: "60px",
                      "& .MuiInputBase-input": {
                        color: "text.primary",
                        backgroundColor: "background.paper",
                        padding: "5px 10px",
                        borderRadius: "4px"
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveStand(stand.id)}
                    size="small"
                    sx={{ color: "grey.200", ml: 1 }}
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
            value={numberOfTeams}
            inputProps={{
              className: "input-number",
              min: "0", // Minimum value
              max: "30",
              step: "1"
            }}
            onChange={event => {
              const numTeams = parseInt(event.target.value, 10);
              if (!isNaN(numTeams)) {
                setNumberOfTeams(numTeams);
                selectedTheme && generateTeamNames(numTeams, selectedTheme);
              }
            }}
          />
        </Grid>

        <Grid display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Autocomplete
            disablePortal
            id="theme-autocomplete"
            options={formattedCategories}
            sx={{ mb: 2 }}
            getOptionLabel={option => option}
            onChange={handleThemeChange}
            renderInput={params => <TextField {...params} label="Choisir un thème" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Liste des équipes
          </Typography>
          {/* Display Team list if teamList is not empty*/}
          {teamList.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
              {teamList.map((team, index) => (
                <Box key={index} bgcolor="primary.main" color="primary.contrastText" p={1} borderRadius={1}>
                  Équipe {team.teamName}
                  <IconButton onClick={() => handleRemoveTeam(index)} size="small" sx={{ color: "grey.200" }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        <Grid display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Button variant="outlined" color="secondary" sx={{ minWidth: 300 }} onClick={handleGetScenario}>
            Générer les rotations
          </Button>
        </Grid>
        <CustomSnackbar ref={snackbarRef} />
      </Grid>
      {/* END Container for Teams params */}
    </>
  );
};

export default TeamsStandsParams;
