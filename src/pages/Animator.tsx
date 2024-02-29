import React from "react";
import PageContainer from "../layouts/PageContainer";
import { Button } from "@mui/material";
import BasicSelect from "../components/BasicSelect";


const Animator: React.FC = () => {

  return (
    <PageContainer role="Animateur">
      <h2>Animateur</h2>
      <BasicSelect label="Qui suis-je ?" idAttribute="who"/>
      <h2>Stand</h2>
      <BasicSelect label="Quel stand ?" idAttribute="why"/>
      <Button variant="contained" sx={{ minWidth: 300 }}>C'est parti !</Button>
    </PageContainer>
  );
};

export default Animator;
