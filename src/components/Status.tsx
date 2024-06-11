import STATUS from "@/utils/statusCode";

interface StatusProps {
  status: string;
}

const Status = ({ status }: StatusProps) => {
  // Function to translate status code to string
  const getStatusString = (statusCode: string) => {
    return (STATUS as Record<string, string>)[statusCode] || "";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Statut</h2>
      <p>{getStatusString(status)}</p>
    </div>
  );
};

export default Status;
