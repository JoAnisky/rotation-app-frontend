import { ActivityStatus } from "@/types/ActivityStatus";
import STATUS from "@/utils/statusCode";

export interface StatusProps {
  status: ActivityStatus | null;
}

const Status = ({ status }: StatusProps) => {
  // Function to translate status code to string
  const getStatusString = (statusCode: string | null) => {
    return statusCode ? (STATUS as Record<string, string>)[statusCode] || "" : "Unknown";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Statut d'activité</h2>
      <h3>{getStatusString(status)}</h3>
    </div>
  );
};

export default Status;
