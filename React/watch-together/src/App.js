import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AnimeList from './pages/AnimeList';
import AnimePage from './pages/AnimePage';
import WatchRoom from './pages/WatchRoom';
import TestPage from './pages/TestPage';

export const serverURL = "localhost:80";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/series-list" element={<AnimeList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anime/:id" Component={AnimePage} />
        <Route path="/room/:roomId" Component={WatchRoom} />
        <Route path="/test" Component={TestPage} />
      </Routes>
    </Router>
  );
}

export default App;
