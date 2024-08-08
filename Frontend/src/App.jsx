import Login from "./Login"
import { ToastContainer } from 'react-toastify';
import Mainmenu from './Mainmenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Mainmenu" element={<Mainmenu />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App
