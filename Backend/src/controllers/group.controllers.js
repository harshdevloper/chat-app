// controllers/group.controllers.js
import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user._id;

    const group = await Group.create({ name, members, createdBy });
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId }).populate("members", "-password");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({ groupId }).populate("senderId", "fullName profilePic");
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
