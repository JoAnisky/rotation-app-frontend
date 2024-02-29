// PageContainer.tsx
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import NavbarUp from "../components/NavbarUp";
import NavbarDown from "../components/NavbarDown";

type PageContainerProps = {
  children: React.ReactNode; // To accept any valid React component or HTML element
  role: string;
};

const PageContainer: React.FC<PageContainerProps> = ({ children, role }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <NavbarUp role={role} />
        <Box className="content-wrapper">{children}</Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <NavbarDown />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PageContainer;
