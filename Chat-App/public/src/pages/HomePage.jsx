import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
    <div className="w-full h-screen bg-gradient-to-r from-neutral-600 from-15% via-blue-500 via-40% to-neutral-600 to-90% ... shadow-md p-4">
      {currentUser && (
        <div>
          <div>
            <Logout className="justify-items-end"/>
          </div>
          <div>
            <div>
              <AvatarWithName
                name={currentUser.avatarImage}
                alt={currentUser.avatarImage}
                className="h-32"
              />
              <span className="text-stone-200">Hello {currentUser.username}</span>
            </div>
          </div>
          <div>
            <div>
              <button>
                <Link to="/userProfile">Profile</Link>
              </button>
            </div>
            <div>
              <button>
                <Link to="/chat">Chat</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
