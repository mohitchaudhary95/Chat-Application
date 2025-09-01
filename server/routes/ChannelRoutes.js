import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {
  createChannel,
  getAllChannels,
  getChannelMessages,
} from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel",verifyToken, createChannel);

channelRoutes.get("/get-all-channels", verifyToken,getAllChannels);
channelRoutes.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessages
);

export default channelRoutes;
