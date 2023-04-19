import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, getUserWithFriendsRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/ContactsChat";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";

export default function Chat() {
  const socket =io(host)
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false)

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
    fetchUser()
  }, []);

  useEffect(()=>{
    if(currentUser){
      socket.emit("add-user",currentUser._id)
    }
  },[currentUser])

  useEffect(() => {  
    if(currentUser){
      setContacts(currentUser.friends)
      setIsLoaded(true);
    }  
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]">
      <div className="container h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-[1fr,3fr] md:grid-cols-[2fr,3fr] gap-4">
        <Contacts allContacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        {
          isLoaded && currentChat===undefined ?(
              <Welcome currentUser={currentUser}/>
          ):(
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
          )
        }
      </div>
      
    </div>
  );
}

/*const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;*/
