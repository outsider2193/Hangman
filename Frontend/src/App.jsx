import Landingpage from "./Landingpage";
import Register from "./Register";
import Login from "./Login"
import Mainmenu from './Mainmenu';
import Gamescreen from "./Gamescreen";
import Wordmanagement from "./Wordmanagement";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Mainmenu" element={<Mainmenu />} />
        <Route path="/game/:matchId" element={<Gamescreen />} />
        <Route path="/wordManagement" element={<Wordmanagement />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App
