import React, { useState, useEffect } from "react";
import PageContainer from "../layouts/PageContainer";
import { Autocomplete, Button, TextField } from "@mui/material";
import BasicSelect from "../components/BasicSelect";
import useFetch from "../hooks/useFetch";
import { ANIMATOR_API } from "../api/routes/animatorRoutes";
import { STANDS_API } from "../api/routes/standRoutes";

interface IAnimator {
  id: number;
  name: string;
  stand: string | null;
  user: {
    id: number;
  };
}

interface IStand {
  id: number;
  name: string;
  is_competitive: boolean;
  animator: number | null;
  activity: {
    id: number;
  };
}
// Type for the selected animator state
interface SelectedValue {
  id: number;
  name: string;
}

const Animator: React.FC = () => {
  const [animators, setAnimators] = useState<IAnimator[]>([]);
  const [selectedAnimator, setSelectedAnimator] =
    useState<SelectedValue | null>(null);

  const [stands, setStands] = useState<IStand[]>([]);
  const [selectedStand, setSelectedStand] = useState<SelectedValue | null>(
    null
  ); // State for the selected stand

  const [fetchedAnimatorsData, animatorsLoading, animatorsError] = useFetch<
    IAnimator[]
  >(ANIMATOR_API.animators);

  const [fetchedStandsData, standsLoading, standsError] = useFetch<IStand[]>(
    STANDS_API.stands
  );

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

  return (
    <PageContainer role="Animateur">
      <h2>Animateur</h2>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
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
        loading={animatorsLoading} // Set the loading prop based on your loading state
        loadingText="Chargement..." // Customize the loading text
        noOptionsText="Aucune option" // Customize the text displayed when there are no options
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Qui êtes-vous ?" />
        )}
      />
      {/* <BasicSelect label="Qui suis-je ?" idAttribute="who"/> */}
      <h2>Stand</h2>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={stands}
        getOptionLabel={(option) => option.name}
        onChange={(event, value: IStand | null) => {
          setSelectedStand(value ? { id: value.id, name: value.name } : null); // Update the selectedStand state
          console.log("Id stand : ", value?.id);
          console.log("Nom stand : ", value?.name);
        }}
        loading={standsLoading} // Set the loading prop based on your loading state
        loadingText="Chargement..." // Customize the loading text
        noOptionsText="Aucune option"
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Quel stand ?" />
        )}
      />

      <Button variant="contained" sx={{ minWidth: 300 }}>
        C'est parti !
      </Button>
    </PageContainer>
  );
};

export default Animator;
