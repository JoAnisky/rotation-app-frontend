import React from "react";
import Layout from "../components/Layout";
import Status from "../components/Status";
import Timer from "../components/Timer";
import { Box } from "@mui/material";


const Participant: React.FC = () => {
  return (
    <Layout role="Participant">
      <Status/>
      <Timer/>
      <p>A la fin du temps, se rendre :</p>
      <Box>Stand N°</Box>
    </Layout>
  );
};

export default Participant;
