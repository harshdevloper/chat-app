import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
     origin: [
      "http://localhost:5173", // local dev
      "https://chat-application-frontend-npjd.onrender.com" // deployed frontend
    ],
    credentials: true,
  },
});

// Helper functions and storage
const userSocketMap = {}; // { userId: socketId }
const groupMembers = {}; // { groupId: [userId1, userId2, ...] }

// Get receiver's socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Get online members of a group
function getOnlineGroupMembers(groupId) {
  const members = groupMembers[groupId] || [];
  return members.filter((member) => userSocketMap[member]);
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit the updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle group join request
  socket.on("joinGroup", ({ groupId }) => {
    if (!groupMembers[groupId]) {
      groupMembers[groupId] = [];
    }
    if (!groupMembers[groupId].includes(userId)) {
      groupMembers[groupId].push(userId);
    }
    console.log(`User ${userId} joined group ${groupId}`);
    socket.join(groupId);

    // Notify other group members about the new user
    io.to(groupId).emit("groupUpdate", {
      groupId,
      members: getOnlineGroupMembers(groupId),
    });
  });

  // Handle group message
  socket.on("sendGroupMessage", ({ groupId, message }) => {
    const groupMessage = {
      senderId: userId,
      groupId,
      text: message.text,
      image: message.image || null,
      timestamp: new Date(),
    };

    console.log(`Group message sent to group ${groupId}:`, groupMessage);

    // Broadcast the message to all members in the group
    io.to(groupId).emit("receiveGroupMessage", groupMessage);
  });

  // Handle private message
  socket.on("sendPrivateMessage", ({ receiverId, message }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receivePrivateMessage", {
        senderId: userId,
        text: message.text,
        image: message.image || null,
        timestamp: new Date(),
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];

    // Remove user from any groups they are part of
    for (const groupId in groupMembers) {
      groupMembers[groupId] = groupMembers[groupId].filter((member) => member !== userId);
      // Notify remaining group members about the updated group list
      io.to(groupId).emit("groupUpdate", {
        groupId,
        members: getOnlineGroupMembers(groupId),
      });
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
