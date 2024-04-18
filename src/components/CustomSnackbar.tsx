import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

// Alert component
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomSnackbarProps {
  open: boolean;
  handleClose: () => void;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  handleClose,
  message,
  severity = "info",
}) => {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {" "}
      {/* This Box centers its contents horizontally */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // This positions the Snackbar at the bottom-center of its container
        sx={{ width: "auto", maxWidth: "100%", mb:5 }} // Ensures Snackbar doesn't exceed the width of its contents or screen
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "auto", minWidth: "fit-content" }}
        >
          {" "}
          {/* Alert takes width as per content */}
          {message}
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
};

export default CustomSnackbar;
