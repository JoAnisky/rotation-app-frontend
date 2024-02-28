import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
 const NavbarDown = () => {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Stand"
        value="stand"
        icon={<StorefrontIcon />}
      />
      <BottomNavigationAction label="Vue générale" value="vue générale" icon={<MapOutlinedIcon />} />
    </BottomNavigation>
  );
}

export default NavbarDown;