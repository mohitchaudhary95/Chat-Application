import React, { useEffect, useState } from 'react'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChatContainer } from './components/chat-container';
import { EmptyChatContainer } from './components/empty-chat-container';
import { ContactsContainer } from './components/contacts-container';

const Chat = () => {

  const {userInfo}=useAppStore();
  const navigate=useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast("please setup profile to continue.");
      navigate("/profile");
    }
  },[userInfo, navigate]);


  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      <ContactsContainer/>
      {/* {selectedChat ? (
        <ChatContainer selectedChat={setSelectedChat} />
      ) : (
        <EmptyChatContainer />
      )} */}
      <ChatContainer/>
    </div>
  )
}

export default Chat