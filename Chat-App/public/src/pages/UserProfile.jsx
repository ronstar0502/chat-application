import React, { useEffect, useState } from "react";
import AvatarWithName from "../components/AvatarWithName";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import {
  addFriendRoute,
  allUsersRoute,
  getUserWithFriendsRoute,
  host,
  removeFriendRoute,
} from "../utils/APIRoutes";
import axios from "axios";
import ContactsProfile from "../components/ContactsProfile";
import Friends from "../components/Friends";
import { io } from "socket.io-client";

export default function UserProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [socketInstance, setSocketInstance] = useState(null);

  async function fetchUser() {
    try {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const currentUserData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const userData = await axios.get(
          `${getUserWithFriendsRoute}/${currentUserData._id}`
        );
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
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)

          const nonFriendContacts = data.data.filter((contact) => {
            return !currentUser.friends.some(
              (friend) => friend._id === contact._id
            )
          })

          setContacts(nonFriendContacts)
          setIsLoaded(true);
        } else {
          navigate("/setAvatar")
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  async function fetchFriends() {
    try {
      if (currentUser) {
        setFriends(currentUser.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }

  useEffect(() => {
    if (currentUser) {  
      const socket = io(host)
      setSocketInstance(socket)

      socket.emit("add-user", currentUser._id)

      socket.on("friendUpdate", async () => {
        console.log("Friend update received")
        try {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          
          const updatedUserData = await axios.get(
            `${getUserWithFriendsRoute}/${currentUser._id}`
          )

          setCurrentUser(updatedUserData.data)

          const nonFriendContacts = data.data.filter((contact) => {
            return !currentUser.friends.some(
              (friend) => friend._id === contact._id
            )
          })

          const removedFriend = currentUser.friends.find(
            (friend) => !updatedUserData.data.friends.some((updatedFriend) => updatedFriend._id === friend._id)
          )

          if (removedFriend) {
            nonFriendContacts.push(removedFriend);
          }

          setContacts(nonFriendContacts)
          setFriends(updatedUserData.data.friends);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })   
      fetchContacts()  
      fetchFriends()
    }
  }, [currentUser])


  async function addFriend(currentUserId, addFriendId) {
    await axios.post(addFriendRoute, {
      userId: currentUserId,
      friendId: addFriendId,
    });
  }

  async function removeFriend(addFriendId) {
    await axios.post(removeFriendRoute, {
      userId: currentUser._id,
      friendId: addFriendId,
    });
  }

  return (
    <div className="w-full h-screen bg-gradient-to-r from-neutral-600 from-15% via-blue-500 via-40% to-neutral-600 to-90% ... shadow-md p-4">
      {currentUser && isLoaded && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div>
              <div className="mb-4 ">
                <p className="font-semibold text-stone-200">Friends</p>
                <Friends friends={friends} removeFriend={removeFriend} />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="mt-4 flex flex-row">
              <div className="basis-2/3 ">
                <button className=" bg-neutral-500 text-white py-1 px-4 rounded-md hover:bg-neutral-700">
                  <Link to="/chat">Chat</Link>
                </button>
              </div>
              <div className="basis-1/3 ">
                <Logout />
              </div>
            </div>
            <div>
              <AvatarWithName
                name={currentUser.avatarImage}
                alt={currentUser.avatarImage}
                className=""
              />
              <span className="block mt-2 text-xl text-stone-200 text-center	">
                {currentUser.username}
              </span>
            </div>
            <div className="">
              <button className=" bg-neutral-500 text-white py-1 px-4 rounded-md hover:bg-neutral-700">
                <Link to="/setAvatar">Edit my Avatar</Link>
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <div>
              <p className="font-semibold text-white mb-4">Users</p>
              <ContactsProfile
                currentUser={currentUser}
                allContacts={contacts}
                addFriend={addFriend}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
