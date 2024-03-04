import React from "react";
import PageContainer from "../layouts/PageContainer";
import ControlButtons from "../components/Timer/ControlButtons";
import Timer from "../components/Timer/Timer";

const Gamemaster: React.FC = () => {
  return (
    <PageContainer role="Maître du jeu">
      <h1>Maître du jeu</h1>
      <ControlButtons />
      <Timer />
    </PageContainer>
  );
};

export default Gamemaster;
