import { useState, useImperativeHandle, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { Severity } from "@/types/SnackbarTypes";

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = forwardRef((props, ref) => {
  const [snackPack, setSnackPack] = useState({
    message: "",
    severity: "info"
  });
  const [open, setOpen] = useState<boolean>(false);

  const showSnackbar = (message: string, severity: Severity) => {
    setSnackPack({ message, severity });
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    showSnackbar
  }));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ width: "auto", maxWidth: "100%", mb: 5 }}
      >
        <Alert onClose={handleClose} severity={snackPack.severity} sx={{ width: "auto", minWidth: "fit-content" }}>
          {snackPack.message}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default CustomSnackbar;
