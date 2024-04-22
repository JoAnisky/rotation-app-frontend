import React, { useState, useEffect } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import PageContainer from "@/layouts/PageContainer";
import Stand from "./Stand";
import useFetch from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STANDS_API , ANIMATOR_API } from "@/routes/api/";

interface IAnimator {
  id: number;
  name: string;
}

interface IStand {
  id: number;
  name: string;
  is_competitive: boolean;
  animator: string | null;
  activity: {
    id: number;
  };
}
// Type for the selected animator state
interface ISelectedValue {
  id: number;
  name: string;
}

const Animator: React.FC = () => {
  // When animator and stand are selected, store this choice in localstorage.
  const { getItem, setItem } = useLocalStorage("animator_stand");

  const [animatorStandSetted, setAnimatorStandSetted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [animators, setAnimators] = useState<IAnimator[]>([]);
  const [selectedAnimator, setSelectedAnimator] =
    useState<ISelectedValue | null>(null); // State for the selected Animator

  const [stands, setStands] = useState<IStand[]>([]);
  const [selectedStand, setSelectedStand] = useState<ISelectedValue | null>(
    null
  ); // State for the selected stand

  // Fetch animators Data for option list display
  const [fetchedAnimatorsData, animatorsLoading] = useFetch<IAnimator[]>(
    ANIMATOR_API.animators
  );

  // Fetch stands Data for option list display
  const [fetchedStandsData, standsLoading] = useFetch<IStand[]>(
    STANDS_API.stands
  );

  const getSelectedStand = () => {
    try {
      const storedData = getItem();
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error parsing selectedStand from localStorage", error);
      return null;
    }
  };

  useEffect(() => {
    const storedStand = getSelectedStand();
    if (storedStand) {
      setSelectedStand(storedStand);
      // If a stored stand is found, we assume that the animator-stand association has already been set
      setAnimatorStandSetted(true);
    }
  }, [])
  
  // Add a function to handle changing the selection
  const handleChangeSelection = () => {
    setAnimatorStandSetted(false);
    // Optionally clear selectedAnimator and selectedStand if you want to reset the selection entirely
    setSelectedAnimator(null);
    setSelectedStand(null);
    // Clear the stored data from local storage
    setItem(null); // Adjust based on how your useLocalStorage hook handles removing items
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
    if (selectedStand) {
      setItem(JSON.stringify(selectedStand));
    }
  }, [setItem, selectedStand]);


  /**
   * Update the stand in Database
   */
  const updateStand = async (updateData: {
    standId: number;
    animator: number;
  }) => {
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animator: updateData.animator }),
    };

    try {
      const response = await fetch(
        STANDS_API.standById(updateData.standId.toString()),
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // update is ok
      if (response.status == 204) {
        // For component Stand display
        setAnimatorStandSetted(true);

      }
    } catch (error) {
      console.error(`Failed to update activity: `, error);
      setErrorMessage("Erreur attribution du stand")
      // update application state to reflect the error or display an error message
    }
  };

  return (
    <>
      {animatorStandSetted ? (
        <>
          <Stand
            role="Animateur"
            standName={selectedStand?.name}
            handleChangeSelection={handleChangeSelection}
            animatorStandSetted={animatorStandSetted}
          />
        </>
      ) : (
        <PageContainer
          role="Animateur"
          handleChangeSelection={handleChangeSelection}
          animatorStandSetted={animatorStandSetted}
        >
          <h2>Animateur</h2>
          <Autocomplete
            disablePortal
            id="animator-autocomplete"
            options={animators}
            getOptionLabel={(option) => option.name}
            // returns the string to display for each option
            // use the onChange prop to handle the selection, you can
            onChange={(event, value: IAnimator | null) => {
              // Update the selectedAnimator state with the id and name of the selected animator
              setSelectedAnimator(
                value ? { id: value.id, name: value.name } : null
              );
            }}
            loading={animatorsLoading} // Set the loading prop based loading state
            loadingText="Chargement..." // loading text
            noOptionsText="Aucune option" // text displayed when there are no options
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Qui êtes-vous ?" />
            )}
          />
          <h2>Stand</h2>

          <Autocomplete
            disablePortal
            id="stand-autocomplete"
            options={stands}
            getOptionLabel={(option) => option.name}
            onChange={(event, value: IStand | null) => {
              setSelectedStand(
                value ? { id: value.id, name: value.name } : null
              );
            }}
            loading={standsLoading}
            loadingText="Chargement..."
            noOptionsText="Aucune option"
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Quel stand ?" />
            )}
          />

          <Button
            variant="contained"
            sx={{ minWidth: 300 }}
            onClick={() => {
              if (selectedStand && selectedAnimator) {
                updateStand({
                  standId: selectedStand.id,
                  animator: selectedAnimator.id,
                });
                setErrorMessage(null)
              } else {
                // console.log("Stand or Animator not selected");
                setErrorMessage("Merci de choisi un nom et un stand !")
              }
            }}
          >
            C'est parti !
          </Button>
          {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
        </PageContainer>
      )}
    </>
  );
};

export default Animator;
