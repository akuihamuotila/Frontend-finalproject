import { Routes, Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
import TrainingCalendar from "./components/TrainingCalendar";
import Statistics from "./components/Statistics";

const App = () => {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Button
          component={Link}
          to="/customers"
          variant="contained"
          color="primary"
        >
          Asiakkaat
        </Button>
        <Button
          component={Link}
          to="/trainings"
          variant="contained"
          color="primary"
        >
          Harjoitukset
        </Button>
        <Button
          component={Link}
          to="/calendar"
          variant="contained"
          color="primary"
        >
          Kalenteri
        </Button>
        <Button
          component={Link}
          to="/statistics"
          variant="contained"
          color="primary"
        >
          Tilastot
        </Button>
      </nav>
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/trainings" element={<TrainingList />} />
        <Route path="/calendar" element={<TrainingCalendar />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </>
  );
};

export default App;
