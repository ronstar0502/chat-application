import React, { useEffect, useState } from "react";
import AvatarWithName from "./AvatarWithName";

export default function ContactsProfile({ currentUser, allContacts }) {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    setContacts(allContacts);
  }, [currentUser]);
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
          </div>
        );
      })}
    </>
  );
}
