import React, { useEffect, useState } from "react";
import AvatarWithName from "./AvatarWithName";

export default function ContactsProfile({
  currentUser,
  allContacts,
  addFriend,
}) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    setContacts(allContacts);
  }, [currentUser]);

  function handleAddFriend(userId, friendId) {
    try {
      addFriend(userId, friendId);
      console.log("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend", error);
    }
  }

  return (
    <>
      {contacts.map((contact, index) => {
        return (
          <div key={index}>
            <div>
              <AvatarWithName
                name={contact.avatarImage}
                alt={contact.avatarImage}
                className=""
              />
              <span>{contact.username}</span>
            </div>
            <button
              onClick={() => handleAddFriend(currentUser._id, contact._id)}
            >
              Add Friend
            </button>
          </div>
        );
      })}
    </>
  );
}
