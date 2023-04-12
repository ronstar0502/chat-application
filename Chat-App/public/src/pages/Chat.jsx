import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";

export default function Chat() {
  const socket = useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false)

  async function fetchUser(){
    try {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const currentUserData= await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        setCurrentUser(currentUserData);
        setIsLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {   
    fetchUser()
  }, []);

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host)
      socket.emit("add-user",currentUser._id)
    }
  },[currentUser])

  async function fetchContacts(){
    try { 
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log(data.data)
          setContacts(data.data);
          console.log(contacts)
        } else {
          navigate("/setAvatar");
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {  
    if(currentUser){
      fetchContacts()
    }  
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts allContacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        {
          isLoaded && currentChat===undefined ?(
            <Welcome currentUser={currentUser}/>
          ):(
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
          )
        }
      </div>
    </Container>
  );
}

const Container = styled.div`
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
`;
