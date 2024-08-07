import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Box, Paper } from "@mui/material";

interface NavbarDownProps {
  setActiveComponent: (componentKey: string) => void;
  isAdmin: boolean;
}

const NavbarDown: React.FC<NavbarDownProps> = ({ setActiveComponent, isAdmin }) => {
  const [value, setValue] = React.useState("recents");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0, // Assures it takes full width
        width: "100%", // This is redundant but ensures understanding
        zIndex: 1000 // Keeps it above other content
      }}
    >
      <Paper elevation={3} sx={{ width: "100%" }}>
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          {isAdmin ? (
            <BottomNavigationAction
              label="Paramètres"
              value="paramètres"
              onClick={() => setActiveComponent("ActivityForm")}
              icon={<SettingsSuggestIcon />}
            />
          ) : (
            <BottomNavigationAction
              label="Stand"
              value="stand"
              onClick={() => setActiveComponent("Stand")}
              icon={<StorefrontIcon />}
            />
          )}
          {isAdmin && (
            <BottomNavigationAction
              label="Scenario"
              value="scenario"
              onClick={() => setActiveComponent("Scenario")}
              icon={<ReceiptLongIcon />}
            />
          )}

          <BottomNavigationAction
            label="Vue générale"
            value="vue générale"
            onClick={() => setActiveComponent("GeneralView")}
            icon={<MapOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default NavbarDown;
