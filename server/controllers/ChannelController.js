import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";


export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId=req.userId;
    const admin=await User.findById(userId);

    if (!admin) {
      return res.status(400).json({ message: "Name and admin are required" });
    }
    
    const validMembers=await User.find({_id:{$in:members}});

    if(validMembers.length !== members.length){
        return res.status(400).send("Some Members are not valid users.")
    }
    const channel = new Channel({
      name,
      members,
      admin:userId
    });

    await channel.save();

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({updatedAt:-1})


    res.status(200).json({channels});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path:"messages",
      populate:{
        path:"sender",
        select:"_id email firstName lastName image color"
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
