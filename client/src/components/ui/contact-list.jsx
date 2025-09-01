import { getColor } from "../../lib/utils";
import { useAppStore } from "../../store";
import { HOST } from "../../utils/constants";
import { Avatar, AvatarImage } from "./avatar";

const ContactList = ({ contacts = [], isChannel = false }) => {
  const {
    selectedChatType,
    selectedChatData,
    setSelectedChatType,
    setselectedChatData,
    setselectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (!contact) return;

    setSelectedChatType(isChannel ? "channel" : "contact");
    setselectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setselectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts
        .filter(Boolean) 
        .map((contact) => {
          const isSelected =
            selectedChatData?._id && selectedChatData._id === contact?._id;

          return (
            <div
              key={contact?._id}
              className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-[#8417ff] hover:bg-[#8417ff]"
                  : "hover:bg-[#f1f1f111]"
              }`}
              onClick={() => handleClick(contact)}
            >
              <div className="flex gap-5 items-center justify-start text-neutral-300">
                {!isChannel && (
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                    {contact?.image ? (
                      <AvatarImage
                        src={`${HOST}/${contact.image}`}
                        alt="profile"
                        className="object-cover w-full h-full overflow-hidden"
                      />
                    ) : (
                      <div
                        className={`${
                          isSelected
                            ? "bg-[#ffffff22] border border-white/70"
                            : getColor(contact?.color)
                        } uppercase h-10 w-10 text-lg border flex items-center justify-center rounded-full`}
                      >
                        <span>
                          {contact?.firstName?.charAt(0) ??
                            contact?.email?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </Avatar>
                )}

                {isChannel && (
                  <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full text-lg">
                    #
                  </div>
                )}
                <span>
                  {isChannel
                    ? contact?.name ?? "Unnamed Channel"
                    : `${contact?.firstName ?? ""} ${contact?.lastName ?? ""}`}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ContactList;
