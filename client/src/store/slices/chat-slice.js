export const createChatSlice=(set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setselectedChatData: (selectedChatData) => set({selectedChatData}),
    setselectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
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