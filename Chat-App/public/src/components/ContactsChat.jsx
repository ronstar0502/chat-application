import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assests/logo.svg";
import AvatarWithName from "./AvatarWithName";
import Logout from "./Logout";
import { Link } from "react-router-dom";

export default function Contacts({ allContacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImg, setCurrentUserImg] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImg(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImg && currentUserName && (
        <div className="grid grid-rows-[1fr,7fr,2fr] overflow-hidden bg-[#080420]">
          <div className="flex items-center gap-4 justify-center">
            <img src={Logo} alt="" className="h-8"/>
            <h3 className="text-white uppercase">Snappy</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2">
            {allContacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact min-h-[5rem] cursor-pointer w-[90%] rounded-sm p-1 flex gap-4 items-center transition-all duration-500 ease-in-out ${
                    index === currentSelected ? "bg-[#9a86f3]" : "bg-[#ffffff34]"
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div >
                    <AvatarWithName
                      name={contact.avatarImage}
                      alt={contact.avatarImage}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-white">{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-[#0d0d30] flex justify-center items-center gap-8">
            <div className="w-16">
              <AvatarWithName
                name={currentUserImg}
                alt={currentUserImg}
                className="h-16 w-auto"
              />
            </div>
            <div className="text-white">
              <h2 className="md:text-xl">{currentUserName}</h2>
            </div>
            <div>
              <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700">
                <Link to="/userProfile">Home</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      .img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;*/
