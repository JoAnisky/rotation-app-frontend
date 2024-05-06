import { useRef, useState } from "react";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { ACTIVITY_API } from "@/routes/api";
import CustomSnackbar from "@/components/CustomSnackbar";

interface ActivityResponse {
  activity_id: string;
  role: string;
}

const ActivityCode = () => {
  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  const [pincode, setPincode] = useState<string>("");

  const handleJoinActivity = () => {
    console.log("coucou : ", pincode);
    if (!pincode) {
      snackbarRef.current?.showSnackbar("Il faudrait entrer un code PIN", "warning");
      return;
    }
    sendPincode(pincode);
  };

  const sendPincode = async (pincode: string): Promise<void> => {
    try {

      const response = await fetch(`${ACTIVITY_API.getActivityByPinCode(pincode)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to submit pincode");

      const data: ActivityResponse = await response.json();

      console.log("Activity Found ! : ", data);
      
    } catch (error) {
      //console.error("Error submitting data:", error);
      snackbarRef.current?.showSnackbar("Pas d'activité trouvée !", "warning");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "85%",
        p: 2,
        height: "75vh",
        justifyContent: "center"
      }}
    >
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Typography variant="h6" component="h1" sx={{ mb: 2, textAlign: "center" }}>
          Code PIN de l'activité
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="Code PIN"
            sx={{ width: "100%" }}
            variant="outlined"
            value={pincode}
            onChange={e => setPincode(e.target.value)}
          />

          <Button variant="contained" sx={{ mt: 1, mb: 2, width: "100%" }} onClick={handleJoinActivity}>
            Valider
          </Button>
        </Grid>
        <CustomSnackbar ref={snackbarRef}/>
      </Grid>
    </Container>
  );
};

export default ActivityCode;
