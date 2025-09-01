// import { useEffect, useRef, useState } from "react";
// import { useAppStore } from "../../../../../../store";
// import moment from "moment";
// import { apiClient } from "@/lib/api-client";
// import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "../../../../../../utils/constants";
// import { MdFolderZip } from "react-icons/md";
// import { IoMdArrowRoundDown } from "react-icons/io";

// const MessageContainer = () => {
//   const scrollRef = useRef();
//   const [previewImage, setPreviewImage] = useState(null); // modal state

//   const {
//     selectedChatMessages,
//     userInfo,
//     selectedChatData,
//     selectedChatType,
//     setselectedChatMessages,
//   } = useAppStore();

//   useEffect(() => {
//     const getMessages = async () => {
//       try {
//         const res = await apiClient.post(
//           GET_ALL_MESSAGES_ROUTE,
//           { id: selectedChatData._id },
//           { withCredentials: true }
//         );

//         if (res.data.messages) {
//           setselectedChatMessages(res.data.messages);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     const getChannelMessages=async ()=>{
//         try {
//         const res = await apiClient.get(
//           `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
//           { withCredentials: true }
//         );

//         if (res.data.messages) {
//           setselectedChatMessages(res.data.messages);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     if (selectedChatData?._id ){
//       if (selectedChatType === "contact") {
//       getMessages();
//     }}
//       else if (selectedChatType === "channel") {
//       getChannelMessages();
//     }
//   }, [selectedChatData, selectedChatType, setselectedChatMessages]);
  

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [selectedChatMessages]);

//   const checkIfImage = (filePath) => {
//     const imageRegex = /\.(jpeg|jpg|gif|png|webp|svg|ico|heic|heif|bmp|tif)$/i;
//     return imageRegex.test(filePath);
//   };

//   const downloadFile = async (fileUrl) => {
//     try {
//       const response = await apiClient.get(`${HOST}/${fileUrl}`, {
//         responseType: "blob",
//         withCredentials: true,
//       });

//       const blob = new Blob([response.data]);
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = fileUrl.split("/").pop();
//       link.click();
//       URL.revokeObjectURL(link.href);
//     } catch (err) {
//       console.error("Download failed", err);
//     }
//   };

//   const renderDMMessages = (message) => {
//     const isSender = message.sender === userInfo.id;

//     return (
//       <div className={`${isSender ? "text-left" : "text-right"}`}>
//         {/* Text Messages */}
//         {message.messageType === "text" && (
//           <div
//             className={`${
//               message.sender !== selectedChatData._id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33] text-white/80 border-white/20"
//             } border inline-block p-3 rounded-lg my-1 max-w-[50%] break-words`}
//           >
//             {message.content}
//           </div>
//         )}

//         {/* File Messages */}
//         {message.messageType === "file" && (
//           <div
//             className={`${
//               message.sender !== selectedChatData._id
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33] text-white/80 border-white/20"
//             } border inline-block p-3 rounded-lg my-1 max-w-[60%] break-words`}
//           >
//             {checkIfImage(message.fileUrl) ? (
//               <div className="relative group">
//                 <img
//                   src={`${HOST}/${message.fileUrl}`}
//                   className="rounded-lg max-h-[300px] object-contain cursor-pointer"
//                   alt="file"
//                   onClick={() => setPreviewImage(`${HOST}/${message.fileUrl}`)}
//                 />
//                 <span
//                   className="absolute bottom-2 right-2 bg-black/60 text-white text-xl p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     downloadFile(message.fileUrl);
//                   }}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3 text-sm">
//                 <span className="text-3xl bg-black/20 rounded-full p-2">
//                   <MdFolderZip />
//                 </span>
//                 <span className="truncate max-w-[150px]">
//                   {message.fileUrl.split("/").pop()}
//                 </span>
//                 <span
//                   className="bg-black/20 text-2xl p-2 rounded-full hover:bg-black/40 cursor-pointer transition"
//                   onClick={() => downloadFile(message.fileUrl)}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//         <div className="text-xs text-gray-400 mt-1">
//           {moment(message.timestamp).format("LT")}
//         </div>
//       </div>
//     );
//   };

//     const renderChannelMessages = (message) => {
//     const isSender = message.sender._id === userInfo.id;

//     return (
//       <div className={`${isSender ? "text-left" : "text-right"}`}>
//         {!isSender && (
//           <div className="text-xs text-gray-400 mb-1">
//             {message.sender.username || "Unknown"}
//           </div>
//         )}
//         {message.messageType === "text" && (
//           <div
//             className={`${
//               isSender
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33] text-white/80 border-white/20"
//             } border inline-block p-3 rounded-lg my-1 max-w-[50%] break-words`}
//           >
//             {message.content}
//           </div>
//         )}
//         {message.messageType === "file" && (
//           <div
//             className={`${
//               isSender
//                 ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//                 : "bg-[#2a2b33] text-white/80 border-white/20"
//             } border inline-block p-3 rounded-lg my-1 max-w-[60%] break-words`}
//           >
//             {checkIfImage(message.fileUrl) ? (
//               <div className="relative group">
//                 <img
//                   src={`${HOST}/${message.fileUrl}`}
//                   className="rounded-lg max-h-[300px] object-contain cursor-pointer"
//                   alt="file"
//                   onClick={() => setPreviewImage(`${HOST}/${message.fileUrl}`)}
//                 />
//                 <span
//                   className="absolute bottom-2 right-2 bg-black/60 text-white text-xl p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     downloadFile(message.fileUrl);
//                   }}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3 text-sm">
//                 <span className="text-3xl bg-black/20 rounded-full p-2">
//                   <MdFolderZip />
//                 </span>
//                 <span className="truncate max-w-[150px]">
//                   {message.fileUrl.split("/").pop()}
//                 </span>
//                 <span
//                   className="bg-black/20 text-2xl p-2 rounded-full hover:bg-black/40 cursor-pointer transition"
//                   onClick={() => downloadFile(message.fileUrl)}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//         <div className="text-xs text-gray-400 mt-1">
//           {moment(message.timestamp).format("LT")}
//         </div>
//       </div>
//     );
//   };


//   const renderMessages = () => {
//     let lastDate = null;
//     return selectedChatMessages.map((message) => {
//       const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
//       const showDate = messageDate !== lastDate;
//       lastDate = messageDate;

//       return (
//         <div key={message._id} ref={scrollRef}>
//           {showDate && (
//             <div className="text-center text-gray-500 text-sm my-2">
//               {moment(message.timestamp).format("LL")}
//             </div>
//           )}
//           {selectedChatType === "contact" && renderDMMessages(message)}
//           {selectedChatType === "channel" && renderChannelMessages(message)}
//         </div>
//       );
//     });
//   };

//   return (
//     <>
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-6 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
//         {renderMessages()}
//       </div>

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//           <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
//             <img
//               src={previewImage}
//               alt="preview"
//               className="rounded-lg max-h-[80vh] object-contain"
//             />
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={() => downloadFile(previewImage.replace(`${HOST}/`, ""))}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <IoMdArrowRoundDown /> Download
//               </button>
//               <button
//                 onClick={() => setPreviewImage(null)}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default MessageContainer;


import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "../../../../../../utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    selectedChatMessages,
    userInfo,
    selectedChatData,
    selectedChatType,
    setselectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (res.data.messages) {
          setselectedChatMessages(res.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (res.data.messages) {
          setselectedChatMessages(res.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setselectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpeg|jpg|gif|png|webp|svg|ico|heic|heif|bmp|tif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (fileUrl) => {
    try {
      const response = await apiClient.get(`${HOST}/${fileUrl}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileUrl.split("/").pop();
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const renderDMMessages = (message) => {
    const isSender =
      message.sender._id?.toString() === userInfo.id ||
      message.sender?.toString() === userInfo.id;

    return (
      <div className={`${isSender ? "text-right" : "text-left"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#2a2b33] text-white/80 border-white/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              isSender
                ? "bg-[#2a2b33] text-white/80 border-white/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-1 max-w-[60%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="relative group">
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  className="rounded-lg max-h-[300px] object-contain cursor-pointer"
                  alt="file"
                  onClick={() => setPreviewImage(`${HOST}/${message.fileUrl}`)}
                />
                <span
                  className="absolute bottom-2 right-2 bg-black/60 text-white text-xl p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-3xl bg-black/20 rounded-full p-2">
                  <MdFolderZip />
                </span>
                <span className="truncate max-w-[150px]">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 text-2xl p-2 rounded-full hover:bg-black/40 cursor-pointer transition"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const isSender = message.sender._id === userInfo.id;
    return (
      <div className={`${isSender ? "text-right" : "text-left"}`}>
        {!isSender && (
          <div className="text-xs text-gray-400 mb-1">
            {message.sender.firstName} {message.sender.lastName}
          </div>
        )}

        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#2a2b33] text-white/80 border-white/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              isSender
                ? "bg-[#2a2b33] text-white/80 border-white/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-1 max-w-[60%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="relative group">
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  className="rounded-lg max-h-[300px] object-contain cursor-pointer"
                  alt="file"
                  onClick={() => setPreviewImage(`${HOST}/${message.fileUrl}`)}
                />
                <span
                  className="absolute bottom-2 right-2 bg-black/60 text-white text-xl p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-3xl bg-black/20 rounded-full p-2">
                  <MdFolderZip />
                </span>
                <span className="truncate max-w-[150px]">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 text-2xl p-2 rounded-full hover:bg-black/40 cursor-pointer transition"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id} ref={scrollRef}>
          {showDate && (
            <div className="text-center text-gray-500 text-sm my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-6 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
            <img
              src={previewImage}
              alt="preview"
              className="rounded-lg max-h-[80vh] object-contain"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={() =>
                  downloadFile(previewImage.replace(`${HOST}/`, ""))
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <IoMdArrowRoundDown /> Download
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
