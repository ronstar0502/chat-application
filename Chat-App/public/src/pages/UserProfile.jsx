import React, { useEffect, useState } from "react";
import AvatarWithName from "../components/AvatarWithName";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { allUsersRoute } from "../utils/APIRoutes";
import axios from "axios";
import ContactsProfile from "../components/ContactsProfile";

export default function UserProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [isLoaded,setIsLoaded] = useState(false)

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

  async function fetchContacts() {
    try {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
          setIsLoaded(true)
        } else { 
          navigate("/setAvatar");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchContacts();
    }
  }, [currentUser]);

  return (
    <>
      {currentUser && isLoaded &&(
        <div>
          <div>
            <div>
              <Link to="/">Home</Link>
              <Logout />
            </div>
          </div>
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
            <div>Contacts</div>
            <div>
              <ContactsProfile currentUser={currentUser} allContacts={contacts}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
