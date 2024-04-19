export type Severity = "error" | "warning" | "info" | "success";

export interface SnackMessage {
  message: string;
  severity?: Severity;
}