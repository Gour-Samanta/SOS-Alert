import "./homePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {NavLink, useNavigate} from 'react-router-dom';

export default function HomePage() {
  const [active, setActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

async function handleSendSms() {
    if(sending) return;
    setSending(true);
    
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/sos`,
          {
            latitude,
            longitude
          },
          {withCredentials: true}
        );

        // navigate("/sos");
      } catch (error) {
        console.log(error);
        setSending(false);
        setActive(false);
        navigate("/signup"); // Redirect to signup page on error

      }
    },
    (error) => {
      console.log("Location error:", error);
      setSending(false);
      setActive(false);
    }
  );
}
useEffect(() => {
  const getUser = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/get-user`,
      { withCredentials: true }
    );

    setUser(response.data.user.name);
    console.log("User data fetched successfully:", response.data.user.name);
  };

  getUser();
}, []);



  return (
    <div className="container">
        <NavLink className="user" to="/signup">
        {user ? <p>{user}</p>:<AccountCircleIcon className="user-icon" />}
        </NavLink>
      <div
        className={`sos-wrapper ${active ? "active" : ""}`}
        onClick={() => setActive(true)}
      >
        <span className="ring ring1"></span>
        <span className="ring ring2"></span>
        <span className="ring ring3"></span>
        <span className="ring ring4"></span>

        <div className="main-content" onClick={handleSendSms}>
          <h2 className="sos">SOS</h2>
        </div>
      </div>
    </div>
  );
}
