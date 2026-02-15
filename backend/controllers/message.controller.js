import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.log("Error in sendMessage route:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await Message.find({
      _id: { $in: conversation.messages },
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessage route:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
