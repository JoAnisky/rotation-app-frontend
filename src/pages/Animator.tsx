import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, Button, Container, Grid, TextField, Typography } from "@mui/material";
import Stand from "./Stand";
import useFetch from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ANIMATOR_API, ACTIVITY_API } from "@/routes/api/";
import { IStand } from "@/types/ActivityInterface";
import NavbarUp from "@/components/NavbarUp";
import useActiveComponent from "@/hooks/useActiveComponent";
import NavbarDown from "@/components/NavbarDown";
import GeneralView from "./GeneralView";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import CustomSnackbar from "@/components/CustomSnackbar";
import ActivityCode from "./ActivityCode";

interface IAnimator {
  id: number;
  name: string;
  stands?: IStand[] | null;
}

// Type for the selected animator state
interface UpdateAnimatorStandsData {
  animator: number;
  stands: IStand[];
}

const Animator: React.FC = () => {
  // When animator and stand are selected, store this choice in localstorage.
  const { getItem, setItem } = useLocalStorage("animator_stand");

  const [animatorStandSetted, setAnimatorStandSetted] = useState<boolean>(false);

  const [animators, setAnimators] = useState<IAnimator[]>([]);
  const [selectedAnimator, setSelectedAnimator] = useState<IAnimator | null>(null); // State for the selected Animator

  const [stands, setStands] = useState<IStand[]>([]);
  const [selectedStands, setSelectedStands] = useState<IStand[]>([]); // State for the selected stand

  // Fetch animators Data for option list display
  const [fetchedAnimatorsData, animatorsLoading] = useFetch<IAnimator[]>(ANIMATOR_API.animators);

  // Fetch stands Data for option list display
  const [fetchedStandsData, standsLoading] = useFetch<IStand[]>(ACTIVITY_API.getActivityStands(1));

  // Snackbar message
  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  const getSelectedStandAndAnim = () => {
    try {
      const storedData = getItem();

      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error parsing selectedStand from localStorage", error);
      return null;
    }
  };

  useEffect(() => {
    const storedData = getSelectedStandAndAnim();
    if (storedData) {
      setSelectedAnimator(storedData.animator);
      setSelectedStands(storedData.stands);
      setAnimatorStandSetted(true);
    }
  }, []);

  // Add a function to handle changing the selection
  const handleChangeSelection = () => {
    setAnimatorStandSetted(false);
    // Clear selectedAnimator and selectedStand to reset the selection entirely
    setSelectedAnimator(null);
    setSelectedStands([]);
    // Clear the stored data from local storage
    setItem(null); // Adjust based on how your useLocalStorage hook handles removing items
  };

  const saveSelectionToLocalStorage = () => {
    if (selectedAnimator && selectedStands.length > 0) {
      const storageData = {
        animator: selectedAnimator,
        stands: selectedStands
      };
      setItem(JSON.stringify(storageData)); // Enregistrement dans le localStorage
    }
  };

  useEffect(() => {
    // Ensure fetchedAnimatorsData is an array before setting it to state
    if (Array.isArray(fetchedAnimatorsData)) {
      setAnimators(fetchedAnimatorsData);
    } else {
      // Handle the case where fetchedAnimatorsData is not an array
      setAnimators([]);
    }
  }, [fetchedAnimatorsData]);

  useEffect(() => {
    if (Array.isArray(fetchedStandsData)) {
      setStands(fetchedStandsData);
    } else {
      setStands([]);
    }
  }, [fetchedStandsData]);

  useEffect(() => {
    saveSelectionToLocalStorage();
  }, [selectedAnimator, selectedStands]);

  const handleSelectedStands = () => {
    // If no stand selected
    if (selectedStands.length == 0) {
      snackbarRef.current?.showSnackbar("Il faudrait choisir au moins un stand !", "warning");
      return;
    }

    // If no animator Selected
    if (!selectedAnimator) {
      snackbarRef.current?.showSnackbar("Qui êtes vous ?", "warning");
      return;
    }

    updateAnimatorStands({
      animator: selectedAnimator.id,
      stands: selectedStands
    });
  };
  /**
   * Update the stand in Database
   */
  const updateAnimatorStands = async (updateData: UpdateAnimatorStandsData) => {
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData.stands)
    };

    try {
      const response = await fetch(ANIMATOR_API.setAnimatorStands(updateData.animator), options);
      if (!response.ok) {
        snackbarRef.current?.showSnackbar("Erreur de requête vers la BDD", "error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // update is ok

      // For component Stand display
      setAnimatorStandSetted(true);
    } catch (error) {
      console.error(`Failed to update animator: `, error);
      snackbarRef.current?.showSnackbar("Erreur attribution du stand", "error");
      // update application state to reflect the error or display an error message
    }
  };

  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "ActivityCode",
    components: {
      ActivityCode: <ActivityCode/>,
      Stand: <Stand standInfos={selectedStands || []} role={"Animateur"} />,
      GeneralVieuw: <GeneralView />
    }
  });

  return (
    <Container sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0" }}>
      {/* If animator has not yet selected his stand(s) */}
      {!animatorStandSetted ? (
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
            gap: "10px"
          }}
        >
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Typography variant="h6" component="h1" sx={{ mb: 2, textAlign: "center" }}>
              Animateur
            </Typography>
            <Autocomplete
              disablePortal
              id="animator-autocomplete"
              options={animators}
              getOptionLabel={option => option.name}
              // returns the string to display for each option
              // use the onChange prop to handle the selection, you can
              onChange={(event, value: IAnimator | null) => {
                // Update the selectedAnimator state with the id and name of the selected animator
                setSelectedAnimator(value ? { id: value.id, name: value.name } : null);
              }}
              loading={animatorsLoading} // Set the loading prop based loading state
              loadingText="Chargement..." // loading text
              noOptionsText="Aucune option" // text displayed when there are no options
              renderInput={params => <TextField {...params} label="Qui êtes-vous ?" />}
            />
          </Grid>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Typography variant="h6" component="h1" sx={{ mb: 2, textAlign: "center" }}>
              Stand(s)
            </Typography>

            <Autocomplete
              disablePortal
              multiple
              id="stand-autocomplete"
              options={stands}
              getOptionLabel={option => option.name}
              onChange={(event, value) => setSelectedStands(value)}
              loading={standsLoading}
              loadingText="Chargement..."
              noOptionsText="Aucune option"
              renderInput={params => <TextField {...params} label="Quel stand(s) ?" />}
            />
          </Grid>

          <Grid item xs={12} sx={{ width: "100%" }}>
            <Button sx={{ width: "100%" }} variant="contained" onClick={handleSelectedStands}>
              C'est parti !
            </Button>
          </Grid>
          <CustomSnackbar ref={snackbarRef} />
        </Container>
      ) : (
        <>
          {/* Animator and stand are setted */}
          <NavbarUp
            role={"Animateur"}
            animatorName={selectedAnimator && selectedAnimator.name}
            handleChangeSelection={() => handleChangeSelection?.()}
            animatorStandSetted={animatorStandSetted}
          />
          {renderActiveComponent()}
          <NavbarDown setActiveComponent={setActiveComponent} isAdmin={false} />
        </>
      )}
    </Container>
  );
};

export default Animator;
