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
    <Box sx={{ width: 500 }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Corrected anchorOrigin syntax
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
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
