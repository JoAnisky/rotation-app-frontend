// PageContainer.tsx
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import NavbarUp from "../components/NavbarUp";
import NavbarDown from "../components/NavbarDown";
import useActiveComponent from "../hooks/useActiveComponent";
import Stand from "../pages/Stand";
import GeneralView from "../pages/GeneralView";

type PageContainerProps = {
  children: React.ReactNode; // To accept any valid React component or HTML element
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
};

const PageContainer: React.FC<PageContainerProps> = ({ children, role, handleChangeSelection, animatorStandSetted }) => {
  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "ActivityForm",
    components: {
      Stand: <Stand />,
      GeneralVieuw: <GeneralView />,
    },
  });
  return (
    <React.Fragment>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <NavbarUp role={role} handleChangeSelection={() => handleChangeSelection?.()} animatorStandSetted={animatorStandSetted} />

        <Box className="content-wrapper">{children}</Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <NavbarDown setActiveComponent={setActiveComponent} isAdmin={false} />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PageContainer;
