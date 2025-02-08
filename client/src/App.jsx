import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import HostelPage from "./pages/HostelsPage";
import HostelDetails from "./pages/HostelDetails";
import HostelBooking from "./pages/BookHostel";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hostel" element={<HostelPage />} />
        <Route path="/hostel/:id" element={<HostelDetails />} />
        <Route path="/hostel/:id/book" element={<HostelBooking />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
