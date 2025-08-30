// import { RiCloseFill } from "react-icons/ri";
// import { useAppStore } from "../../../../../../store";
// import { Avatar, AvatarImage } from "../../../../../../components/ui/avatar";
// import { HOST } from "../../../../../../utils/constants";
// import { getColor } from "../../../../../../lib/utils";

// export const ChatHeader = () => {
//   const { closeChat, selectedChatData,selectedChatType } = useAppStore();
//   return (
//     <div className="h-[10vh] border-b-2 iems-center justify-between px-20 border-[#2f303b] ">
//       <div className="flex gap-5 items-center">
//         <div className="flex gap-3 items-center justify-center ">
//           <Avatar className="h-12 w-12 rounded-full overflow-hidden">
//             {selectedChatData.image ? (
//               <AvatarImage
//                 src={`${HOST}/${selectedChatData.image}`}
//                 alt="profile"
//                 className="h-full w-full object-cover bg-black"
//               />
//             ) : (
//               <div
//                 className={`uppercase h-12 w-12 border-[1px] text-lg flex items-center justify-center rounded-full ${getColor(
//                   selectedChatData.color
//                 )}`}
//               >
//                 <span>
//                   {selectedChatData.firstName
//                     ? selectedChatData.firstName.split("").shift()
//                     : selectedChatData?.email?.split("").shift()}
//                 </span>
//               </div>
//             )}
//           </Avatar>
//         </div>
//         <div>
//           {selectedChatType==='contact' && selectedChatData.firstName ? `${selectedChatData.firstName} ? ${selectedChatData.lastName}` : selectedChatData.email}
//         </div>
//         <div className="flex items-ceter justify-center gap-5">
//           <button
//             className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all "
//             onClick={closeChat}
//           >
//             <RiCloseFill className="text-3xl" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

export const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  // This check is crucial to prevent crashes when no chat is selected.
  if (!selectedChatData) {
    return null;
  }

  return (
    <div className="h-[10vh] border-b-2 flex items-center justify-between px-6 md:px-10 border-[#2f303b]">
      {/* Left Section: Avatar and Name */}
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {selectedChatData?.image ? (
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt="profile"
                className="object-cover"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg flex items-center justify-center rounded-full ${getColor(selectedChatData?.color)}`}
              >
                {/* This is the corrected logic. 
                  It safely gets the first initial from either the first name or the email,
                  preventing the "split of undefined" error.
                */}
                <span>
                  {selectedChatData?.firstName?.charAt(0) ?? selectedChatData?.email?.charAt(0)}
                </span>
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-lg font-medium">
          {selectedChatType === 'contact' && selectedChatData?.firstName 
            ? `${selectedChatData.firstName} ${selectedChatData.lastName}` 
            : selectedChatData?.email}
        </div>
      </div>

      {/* Right Section: Close Button */}
      <div className="flex items-center justify-center">
        <button
          className="text-neutral-400 hover:text-white focus:border-none focus:outline-none transition-all duration-300"
          onClick={closeChat}
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};
