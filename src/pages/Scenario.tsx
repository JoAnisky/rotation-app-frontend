import { Box, CssBaseline, Typography } from "@mui/material";

const Scenario = () => {
  return (
    <>
      <CssBaseline />
      <Box height="100%" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
            Affichage du scenario :
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Scenario;
