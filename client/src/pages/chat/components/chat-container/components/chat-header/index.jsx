import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

export const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  if (!selectedChatData) {
    return null;
  }

  return (
    <div className="h-[10vh] border-b-2 flex items-center justify-between px-6 md:px-10 border-[#2f303b]">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 relative">
          {
            selectedChatType==="contact" ? <Avatar className="h-12 w-12 rounded-full overflow-hidden">
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
                <span>
                  {selectedChatData?.firstName?.charAt(0) ?? selectedChatData?.email?.charAt(0)}
                </span>
              </div>
            )}
          </Avatar> : (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full text-lg">
                    #
                  </div>)
          }
          
        </div>
        <div className="text-lg font-medium">
          {selectedChatType==="channel" && selectedChatData.name}
          {selectedChatType === 'contact' && selectedChatData?.firstName 
            ? `${selectedChatData.firstName} ${selectedChatData.lastName}` 
            : selectedChatData?.email}
        </div>
      </div>
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
