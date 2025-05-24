import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {

  try {

    const loggedInUserId = req.user._id;//id of user to which we want to show other users.

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");//here we're extracting all users from database except the current user and here ne equals to not equal to and we're not sending password to user.

    res.status(200).json(filteredUsers);
  } 
  
  catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getMessages = async (req, res) => {

  try {

    const { id: userToChatId } = req.params;//id of the user with which we want to get message history.

    const myId = req.user._id;

    const messages = await Message.find({
      //here we're extracting all the messages in which the logged in user is sender and the route id user is receiver or vice-versa.

      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  }
  
  catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {

  try {

    const { text, image } = req.body;
    const { id: receiverId } = req.params;//receiver id mentioned in route.
    const senderId = req.user._id;

    let imageUrl;//as it is not compulsory that user will send image so first we're making it as an empty variable.

    //if image is send by the user, we'll store it in cludinary and assign a imageurl variable a value

    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

     //implementing real-time functionality
    const receiverSocketId = getReceiverSocketId(receiverId);

    //if user is online, then only we'll send that msg to that particular user.
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } 
  
  catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};