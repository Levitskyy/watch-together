import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import axiosInstance from "../components/axiosInstance";
import { serverURL } from '../App';

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      const response = axiosInstance.post(`http://${serverURL}/api/auth/logout`);
      if (!response) {
        console.error('Error logging out');
      }
      else {
        setToken();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

  return <>Logout Page</>;
};

export default Logout;