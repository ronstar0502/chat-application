import React, { useEffect, useState } from "react";
import AvatarWithName from "../components/AvatarWithName";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { addFriendRoute, allUsersRoute, getUserWithFriendsRoute, removeFriendRoute } from "../utils/APIRoutes";
import axios from "axios";
import ContactsProfile from "../components/ContactsProfile";
import Friends from "../components/Friends";

export default function UserProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [friends,setFriends] = useState([])
  const [isLoaded, setIsLoaded] = useState(false);

  async function fetchUser() {
    try {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const currentUserData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const userData = await axios.get(`${getUserWithFriendsRoute}/${currentUserData._id}`)
        setCurrentUser(userData.data);
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
          setIsLoaded(true);
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
      setFriends(currentUser.friends)
    }
  }, [currentUser]);

  async function addFriend(currentUserId, addFriendId) {
    await axios.post(addFriendRoute, {
      userId:currentUserId,
      friendId:addFriendId,
    });
  }

  async function removeFriend(addFriendId) {
    await axios.post(removeFriendRoute, {
      userId:currentUser._id,
      friendId:addFriendId,
    });
  }

  return (
    <>
      {currentUser && isLoaded && (
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
            <div>Users</div>
            <div>
              <ContactsProfile
                currentUser={currentUser}
                allContacts={contacts}
                addFriend={addFriend}
              />
            </div>
          </div>
          <div>
            <div>Friends</div>
            <div>
              <Friends friends={friends} removeFriend={removeFriend}/>
            </div>
          </div>
          <div>
            <button>
              <Link to="/setAvatar">Edit my Avatar</Link>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
