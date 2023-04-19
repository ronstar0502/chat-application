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
    <div >
      {contacts.map((contact, index) => {
        return (
          <div key={index} >
            <div>
              <AvatarWithName
                name={contact.avatarImage}
                alt={contact.avatarImage}
                className="h-32 "
              />
              <span>{contact.username}</span>
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700"
              onClick={() => handleAddFriend(currentUser._id, contact._id)}
            >
              Add Friend
            </button>
          </div>
        );
      })}
    </div>
  );
}
