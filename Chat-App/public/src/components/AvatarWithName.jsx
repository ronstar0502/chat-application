import React,{useState,useEffect} from "react";

export default function AvatarWithName(props){
    const [avatarUrl, setAvatarUrl] = useState('');
  
    useEffect(() => {
      const url = `https://avatars.dicebear.com/api/avataaars/${props.name}.svg`;
      setAvatarUrl(url);
    }, [props.name]);
  
    return (
      <div>
        <img src={avatarUrl} alt={props.alt} height="100" className={props.className} />
      </div>
    );
  }