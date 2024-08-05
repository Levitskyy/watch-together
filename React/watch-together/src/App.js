import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SeriesList from './pages/SeriesList';
import Register from './pages/Register';
import Login from './pages/Login';
import Movie from './pages/Movie';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/series-list" element={<SeriesList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:id" Component={Movie} />
      </Routes>
    </Router>
  );
}

export default App;
