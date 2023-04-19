import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Robot from "../assests/robot.gif";

export default function Welcome({currentUser}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  return (
    <div className="flex justify-center items-center text-white flex-col">
      <img src={Robot} className="h-[20rem]"/>
      <h1>
        Welcome, <span className="text-[#4e0eff]">{currentUserName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}
