import { useEffect, useRef, useState } from "react";
import { Autocomplete, Button, Container, Grid, TextField, Typography } from "@mui/material";
import useActiveComponent from "@/hooks/useActiveComponent";
import { Stand, GeneralView } from "@/pages";
import { NavbarDown, NavbarUp, CustomSnackbar } from "@/components";
import { ACTIVITY_API } from "@/routes/api";
import { ITeam } from "@/types/ActivityInterface";
import { useActivityContext } from "@/hooks/useActivityContext";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";

const Participant: React.FC = () => {
  const [teamChosen, setTeamChosen] = useState<boolean>(false);

  const { activityId } = useActivityContext();

  // Liste des équipes par rapport au activityID
  const [teamsData, setTeamsData] = useState<ITeam[]>([]);
  const [teamsDataLoading, setTeamsDataLoading] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

  // Snackbar message
  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  // Fetch stands Data for option list display
  useEffect(() => {
    const fetchTeams = async () => {
      if (activityId) {
        setTeamsDataLoading(true);
        try {
          const response = await fetch(ACTIVITY_API.getActivityTeams(activityId), {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          const data = await response.json(); // Assuming the server responds with JSON
          setTeamsData(data || []); // Ensure data is an array
          if (!response.ok) {
            throw new Error(data.message || "Unknown error occurred");
          }
        } catch (err) {
          console.log(err);
          setTeamsData([]); // Set to empty array on error
        } finally {
          setTeamsDataLoading(false);
        }
      }
    };
    fetchTeams();
  }, [activityId]);

  const handleSelectedTeam = () => {
    // If no team selected
    if (!selectedTeam) {
      snackbarRef.current?.showSnackbar("Il faudrait choisir votre équipe !", "warning");
      return;
    }

    setTeamChosen(true);
    setSelectedTeam(selectedTeam);
  };

  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "Stand",
    components: {
      Stand: <Stand teamInfo={selectedTeam ? [selectedTeam] : []} />,
      GeneralView: <GeneralView />
    }
  });
  return (
    <Container sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0" }}>
      {!teamChosen ? (
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "85%",
            p: 2,
            height: "75vh",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Typography variant="h6" component="h1" sx={{ mb: 2, textAlign: "center" }}>
              Rejoindre une équipe
            </Typography>

            <Autocomplete
              disablePortal
              id="team-autocomplete"
              options={teamsData}
              getOptionLabel={option => option.teamName}
              onChange={(_event, value: ITeam | null) => setSelectedTeam(value)} // Ensuring the value type is correctly hinted
              loading={teamsDataLoading}
              loadingText="Chargement..."
              noOptionsText="Pas d'équipe dans cette activité"
              renderInput={params => <TextField {...params} label="Quelle équipe ?" />}
            />
          </Grid>

          <Grid item xs={12} sx={{ width: "100%" }}>
            <Button sx={{ width: "100%" }} variant="contained" onClick={handleSelectedTeam}>
              C'est parti !
            </Button>
          </Grid>
          <CustomSnackbar ref={snackbarRef} />
        </Container>
      ) : (
        <>
          <NavbarUp role={"Participant"} animatorStandSetted={true} />
          {renderActiveComponent()}
          <NavbarDown setActiveComponent={setActiveComponent} isAdmin={false} />
        </>
      )}
    </Container>
  );
};

export default Participant;
