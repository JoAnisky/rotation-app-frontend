export type Severity = "error" | "warning" | "info" | "success";

export interface CustomSnackbarMethods {
  showSnackbar: (message: string, severity: Severity) => void;
}

// Define CustomSnackbarProps interface here
export interface CustomSnackbarProps {
  message?: string;
  severity?: Severity; // Optional with a default value
}