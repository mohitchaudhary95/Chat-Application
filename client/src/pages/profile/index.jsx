// import React, { useEffect, useRef, useState } from "react";
// import { useAppStore } from "@/store";
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import { colors, getColor } from "@/lib/utils";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
// import { apiClient } from '@/lib/api-client';
// import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE } from "../../utils/constants";

// const Profile = () => {
//   const navigate = useNavigate();
//   const { userInfo, setUserInfo } = useAppStore();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [image, setImage] = useState(null); 
//   const [hovered, setHovered] = useState(false);
//   const [selectedColor, setSelectedColor] = useState(0);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (userInfo) {
//       setFirstName(userInfo.firstName || "");
//       setLastName(userInfo.lastName || "");
//       setSelectedColor(userInfo.color || 0);
//     }
//     if(!userInfo.image){
//       setImage(`${HOST}/${userInfo.image}`);
//     }
//   }, [userInfo]);

//   const validateProfile = () => {
//     if (!firstName.trim() || !lastName.trim()) {
//       toast.error("First and Last name are required.");
//       return false;
//     }
//     return true;
//   };

//   const saveChanges = async () => {
//     if (validateProfile()) {
//       try {
//         const res = await apiClient.post(
//           UPDATE_PROFILE_ROUTE, 
//           { firstName, lastName, color: selectedColor }, 
//           { withCredentials: true }
//         );

//         if (res.status === 200 && res.data) {
//           setUserInfo({ ...userInfo, ...res.data });
//           toast.success("Profile updated successfully!");
//           navigate("/chat");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to update profile. Please try again.");
//       }
//     }
//   };

//   const handleNavigate = () => {
//     if (userInfo.profileSetup) {
//       navigate("/chat");
//     } else {
//       toast.error("Please complete your profile setup to continue.");
//     }
//   };

//   const handleFileInputClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const formData=new FormData();
//       formData.append("profile-image",file);
//       const res= await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
//       if(res.status===200 && res.data.image){
//         setImage(file);
//         setUserInfo({...userInfo,image:res.data.image});
//         toast.success("Profile image updated successfully!");
//       } else{
//         toast.error("Failed to upload image. Please try again.");
//       }
//     }
//   };

//   const handleDeleteImage = async () => {
//     try{
//       const res=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{
//         withCredentials:true,
//       });
//       if(res.status===200){
//         setUserInfo({...userInfo,image:null});
//         toast.success("Profile image removed successfully");
//         setImage(null);
//       }
//     }
//     catch(err){
//       console.log(err);
//     }
//   };

//   const getImageSrc = () => {
//     if (image) {
//       if (typeof image === 'string') return image;
//       return URL.createObjectURL(image);
//     }
//     return null;
//   };

//   return (
//     <div className="bg-[#1b1c24] h-screen w-full flex flex-col items-center justify-center gap-10">
//       <div className="flex flex-col gap-10 w-[80vw] md:w-auto">
//         <div>
//           <IoArrowBack onClick={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
//         </div>
//         <div className="grid md:grid-cols-2 gap-10 items-center">
//           <div
//             className="relative flex items-center justify-center"
//             onMouseEnter={() => setHovered(true)}
//             onMouseLeave={() => setHovered(false)}
//           >
//             <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
//               {image ? (
//                 <AvatarImage
//                   src={getImageSrc()}
//                   alt="avatar"
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <div className={`h-32 w-32 md:h-48 md:w-48 text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
//                   <span>
//                     {firstName ? firstName.charAt(0).toUpperCase() : userInfo?.email?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               )}
//             </Avatar>
//             {hovered && (
//               <div 
//                 className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer" 
//                 onClick={image ? handleDeleteImage : handleFileInputClick}
//               >
//                 {image ? (
//                   <FaTrash className="text-white text-3xl" />
//                 ) : (
//                   <FaPlus className="text-white text-3xl" />
//                 )}
//               </div>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//           </div>
//           <div className="flex flex-col gap-5 text-white">
//             <div className="w-full">
//               <input 
//                 placeholder="Email"
//                 type="email"
//                 disabled
//                 value={userInfo?.email || ""}
//                 className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none text-white/50"
//               />
//             </div>
//             <div className="w-full">
//               <input 
//                 placeholder="First Name"
//                 type="text"
//                 onChange={(e) => setFirstName(e.target.value)}
//                 value={firstName}
//                 className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none"
//               />
//             </div>
//             <div className="w-full">
//               <input 
//                 placeholder="Last Name"
//                 type="text"
//                 onChange={(e) => setLastName(e.target.value)}
//                 value={lastName}
//                 className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none"
//               />
//             </div>
//             <div className="w-full flex gap-5">
//               {colors.map((color, index) => (
//                 <div 
//                   key={index}
//                   className={`${color.split(" ")[0]} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
//                     selectedColor === index ? "outline outline-4 outline-white" : ""
//                   }`}
//                   onClick={() => setSelectedColor(index)}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="w-full">
//           <Button 
//             className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-lg"
//             onClick={saveChanges}
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "../../lib/utils";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { 
  UPDATE_PROFILE_ROUTE, 
  ADD_PROFILE_IMAGE_ROUTE, 
  REMOVE_PROFILE_IMAGE_ROUTE, 
  HOST 
} from "../../utils/constants";
import { apiClient } from '../../lib/api-client';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null); 
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color || 0);
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`);
      }
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and Last name are required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE, 
          { firstName, lastName, color: selectedColor }, 
          { withCredentials: true }
        );

        if (res.status === 200 && res.data) {
          setUserInfo({ ...userInfo, ...res.data });
          toast.success("Profile updated successfully!");
          navigate("/chat");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile setup to continue.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile-image", file);
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
        
        if (res.status === 200 && res.data.image) {
          setImage(`${HOST}/${res.data.image}`);
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.success("Profile image updated successfully!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Profile image removed successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  return (
    <div className="bg-[#1b1c24] min-h-screen w-full flex items-center justify-center p-4">
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        <div>
          <IoArrowBack onClick={handleNavigate} className="text-4xl lg:text-5xl text-white/90 cursor-pointer hover:text-white transition-colors" />
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div
            className="relative flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={image ? null : handleFileInputClick}
          >
            <Avatar className="h-36 w-36 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className={`h-full w-full text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  <span>
                    {firstName ? firstName.charAt(0).toUpperCase() : userInfo?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </Avatar>
            {hovered && (
              <div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full transition-opacity" 
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl" />
                ) : (
                  <FaPlus className="text-white text-3xl" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex flex-col gap-5 text-white w-full">
            <input 
              placeholder="Email"
              type="email"
              disabled
              value={userInfo?.email || ""}
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none text-white/50 cursor-not-allowed"
            />
            <input 
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input 
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              className="rounded-lg p-4 w-full bg-[#2c2e3b] border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div 
                  key={index}
                  className={`${color.split(" ")[0]} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                    selectedColor === index ? "outline outline-4 outline-white" : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button 
            className="h-16 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 text-lg font-semibold rounded-lg"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;