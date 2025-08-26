import React, { useState } from 'react'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom';
import {IoArrowBack} from 'react-icons/io5'

const Profile = () => {
  const naviagte=useNavigate();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [image,setImage]=useState(null);
  const [hovered,setHovered]=useState(false);
  const [selectedColor,setSelectedColor]=useState(0);
  const {userInfo}=useAppStore();

  const saveChanges= async ()=>{
    
  }

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center dlex-col gap-10'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <div>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer "/>
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 relative flex items-center justify-center " onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
            <Avatar className='h-32 w-32 md:h-48 rounded-full overflow-hidden'>
              {image ? <AvatarImage src={URL.createObjectURL(image)} alt="avatar" className='h-full w-full object-cover'/> : <span className='text-6xl text-white/50'>{userInfo?.firstName?.charAt(0).toUpperCase()}</span>}
              {hovered && <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                <label htmlFor='imageInput' className='text-white/80 cursor-pointer'>Change</label>
                <input type="file" id='imageInput' className='hidden' accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
              </div>}

            </Avatar>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 