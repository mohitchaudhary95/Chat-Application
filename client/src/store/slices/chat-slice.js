export const createChatSlice=(set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setselectedChatData: (selectedChatData) => set({selectedChatData}),
    setselectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    closeChat: ()=>set({selectedChatData:undefined,selectedChatType:undefined,selectedChatMessages:[]})
})