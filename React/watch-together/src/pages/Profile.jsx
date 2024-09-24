import axiosInstance from "../components/axiosInstance";
import { serverURL } from "../App";
import { useEffect, useState } from "react";

const Profile = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
  

    useEffect(() => {
        const handleProfile = async () => {
            try {
              const response = await axiosInstance.get(`http://${serverURL}/api/auth/me`);
              if (!response) {
                console.error('Error getting me');
              }
              else {
                const data = response.data
                setUsername(data.username);
                setRole(data.role);
              }
            } catch (error) {
              console.error('Error getting me:', error);
            }
          };
      
          handleProfile();
    }, []);
    
  
    return (
        <div>
            <p>My name is: {username}</p>
            <p>My role is: {role}</p>
        </div>
    );
  };
  
  export default Profile;