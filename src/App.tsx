//import Button from "./components/Button";
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  );
};

export default App;
