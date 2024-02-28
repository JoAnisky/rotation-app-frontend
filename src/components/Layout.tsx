// Layout.tsx
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import NavbarUp from './NavbarUp'; // Adjust the import paths as necessary
import NavbarDown from './NavbarDown';

type LayoutProps = {
  children: React.ReactNode; // To accept any valid React component or HTML element
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <NavbarUp />
        <Box display="flex" flex="1" justifyContent="space-around">
          { children }
        </Box>
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

export default Layout;
