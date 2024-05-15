import { useRef, useState } from "react";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { ACTIVITY_API } from "@/routes/api";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useActivityContext } from "@/hooks/useActivityContext";
import { useNavigate, useParams } from "react-router-dom";

interface ActivityResponse {
  activity_id: string;
  role: string;
}

const ActivityCode = () => {
  const { setActivityData } = useActivityContext();
  const { role } = useParams();
  const navigate = useNavigate();

  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  const [pincode, setPincode] = useState<string>("");

  const handleJoinActivity = async () => {
    if (!pincode) {
      snackbarRef.current?.showSnackbar("Il faudrait entrer un code PIN", "warning");
      return;
    }
    role && await sendPincode(role, pincode);
  };

  const sendPincode = async (role: string, pincode: string): Promise<void> => {
    try {
      const response = await fetch(`${ACTIVITY_API.getActivityAndRoleByPinCode(role, pincode)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const errorText = await response.text(); // Safely read the raw text
        snackbarRef.current?.showSnackbar(errorText, "error");
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data: ActivityResponse = await response.json();

      console.log("Activity Found ! : ", data);
      setActivityData(data.activity_id);
      if (role === 'participant') {
        navigate('/participant');
    } else if (role === 'animator') {
        navigate('/animator');
    } else {
        // Unknown role
        navigate('/');
    }
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
        <CustomSnackbar ref={snackbarRef} />
      </Grid>
    </Container>
  );
};

export default ActivityCode;
