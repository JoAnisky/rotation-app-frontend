import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

// Define a type for the props expected by NavbarUp
interface INavbarUpProps {
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean
}

const NavbarUp: React.FC<INavbarUpProps> = ({
  role,
  handleChangeSelection,
  animatorStandSetted
}) => {
  return (
    <Box sx={{ display:'flex' }}>
      <AppBar position="sticky" component="nav">
        <Toolbar>
          {/* IconButton with HomeIcon and Link */}
          <IconButton
            component={Link} // Use Link here
            to="/" // Path to navigate to
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }} // Adjust spacing as needed
          >
            <HomeIcon />
          </IconButton>
          {/* Typography centered by using flex-grow and text-align */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {role}
          </Typography>
          
          {role === "Animateur" && animatorStandSetted ? (
            <Button
              variant="contained"
              onClick={() => handleChangeSelection?.()}
            >
              Changer
            </Button>
          ) : (
            <Box sx={{ width: 48, height: 48 }} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarUp;
