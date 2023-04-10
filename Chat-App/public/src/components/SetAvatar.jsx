import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assests/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import getRandomAvatar from "./randomAvatar";
import { BigHead } from "@bigheads/core";


const AvatarWithName = ({ name }) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const url = `https://avatars.dicebear.com/api/avataaars/${name}.svg`;
    setAvatarUrl(url);
  }, [name]);

  return (
    <div>
      {avatarUrl && <img src={avatarUrl} alt={`${name} Avatar`} height="100" />}
    </div>
  );
}

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  /*useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);*/

  useEffect(()=>{
    getRandomAvatarNames()
  },[])
  
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  /*const getRandomAvatars=(() => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const avt = getRandomAvatar();
      data.push(avt)
    }
    setAvatars(data);
    console.log(avatars)
    setIsLoading(false);
  });*/

  const getRandomAvatarNames=()=>{
    const names = []
    for (let i = 0; i < 4; i++) {
    const randomName = Math.random().toString(36).substring(7)
    names.push(randomName);
    }
    setAvatars(names)
    setIsLoading(false)
  }

  
  
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <AvatarWithName key={index} name={avatar} onClick={() => setSelectedAvatar(index)} />
                </div>
              );
            })}
          </div>
          <button onClick={getRandomAvatarNames} className="submit-btn">Generate Random Avatars</button>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;