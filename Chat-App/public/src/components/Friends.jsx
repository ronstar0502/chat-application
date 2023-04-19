import React, { useEffect, useState } from "react";
import AvatarWithName from "./AvatarWithName";

export default function Friends({ friends, removeFriend }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (friends) {
      console.log(friends);
      setIsLoaded(true);
    }
  }, [friends]);

  function handleRemovedFriend(friendId) {
    try {
      removeFriend(friendId);
      console.log("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend", error);
    }
  }

  return (
    <div>
      {isLoaded &&
        friends.map((friend, index) => {
          return (
            <div key={index} >
              <div>
                <AvatarWithName
                  name={friend.avatarImage}
                  alt={friend.avatarImage}
                  className="h-32"
                />
                <span className="text-stone-200">{friend.username}</span>
              </div>
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700"
                onClick={() => handleRemovedFriend(friend._id)}
              >
                Remove Friend
              </button>
            </div>
          );
        })}
    </div>
  );
}
