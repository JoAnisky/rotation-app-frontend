// Layout.tsx
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import NavbarUp from './NavbarUp';
import NavbarDown from './NavbarDown';

type LayoutProps = {
  children: React.ReactNode; // To accept any valid React component or HTML element
  role: string
};

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <NavbarUp role={role} />
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
