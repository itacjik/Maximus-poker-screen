import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import PokerPage from "./pages/PokerPage";

function App() {

  return (  
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<PokerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
