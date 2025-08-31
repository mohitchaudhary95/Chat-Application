import Message from "../models/MessagesModel.js";


export const getMessages = async (req, res, next) => {
    try {
        const recipientId = req.body.id;
        const senderId = req.userId;

        if (!recipientId || !senderId) {
            return res.status(400).send("Sender and recipient IDs are required.");
        }

        const messages = await Message.find({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId },
            ],
        })
        
        .populate("sender", "id firstName lastName email image color")
        .populate("recipient", "id firstName lastName email image color")
        .sort({ timestamp: 1 });
        return res.status(200).json({ messages });

    } catch (err) {
        console.error("Error fetching messages:", err);
        return res.status(500).send("Internal Server Error");
    }
};
