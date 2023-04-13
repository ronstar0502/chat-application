import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { Link, useNavigate } from "react-router-dom";
import AvatarWithName from "../components/AvatarWithName";
import Logout from "../components/Logout";

export default function HomePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  async function fetchUser() {
    try {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const currentUserData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUser(currentUserData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {currentUser && (
        <div>
            <Logout/>
          <div>
            <div>
              <AvatarWithName
                name={currentUser.avatarImage}
                alt={currentUser.avatarImage}
                className=""
              />
              <span>{currentUser.username}</span>
            </div>
          </div>
          <div>
            <Link to="/userProfile">Profile</Link>
            <Link to="/chat">Chat</Link>
          </div>
        </div>
      )}
    </>
  );
}
