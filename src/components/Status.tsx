import STATUS from "../utils/statusCode";

const Status: React.FC<{ status: STATUS }> = ({ status }) =>  {
  return (
    <div>
      <h2>Statut</h2>
      <p>{status}</p>
    </div>
  );
};

export default Status;
