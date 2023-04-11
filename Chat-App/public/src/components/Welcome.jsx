import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Robot from "../assests/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchData(){
        try {
            setUserName(
              await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
              ).username
            );
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchData()
  }, []);

  return (
    <Container>
      <img src={Robot} />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
