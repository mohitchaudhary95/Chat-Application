export const createChatSlice=(set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    directMessagesContacts:[],
    channels:[],
    setChannels:(channels)=>set({channels}),
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setselectedChatData: (selectedChatData) => set({selectedChatData}),
    setselectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    setDirectMessagesContacts:(directMessagesContacts)=>{
        set({directMessagesContacts})
    },
    addChannel:(channel)=>{
        const Channels=get().channels;
        set({channels:[channel,...Channels]})
    },
    closeChat: ()=>set({selectedChatData:undefined,selectedChatType:undefined,selectedChatMessages:[]}),
    addMessage:(message)=>{
        const selectedChatMessages=get().selectedChatMessages;  
        const selectedChatType=get().selectedChatType;

        set({
            selectedChatMessages:[
                ...selectedChatMessages,
                {
                    ...message,
                    recipient:  
                        selectedChatType==="channel"? message.recipient: message.recipient._id,
                    sender:
                        selectedChatType==="channel"? message.sender: message.sender._id,
                },
            ],
        })
    }
    // addMessage: (message) => {
    //     set((state) => ({
    //         selectedChatMessages: [...state.selectedChatMessages, message],
    //     }));
    // },
})