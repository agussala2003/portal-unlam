import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

// Your page components
import Home from "./pages/Home";
import Careers from "./pages/Careers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CareerPageWrapper from "./pages/CareerPageWrapper";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carreras" element={<Careers />} />
          <Route path="/carreras/:careerId" element={<CareerPageWrapper />} />
          <Route path="/inicio-sesion" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
