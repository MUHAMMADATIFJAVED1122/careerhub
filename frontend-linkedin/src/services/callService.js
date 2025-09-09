// src/services/callService.js
import { io } from "socket.io-client";

const socket = io("https://careerhubbackend-qnhl.onrender.com", {
  transports: ["websocket"], // faster connection
});

// ------------------
// Join socket
// ------------------
export const joinCallSocket = (userId) => {
  if (!userId) return;
  socket.emit("join", userId);
};

// ------------------
// Call user
// ------------------
export const callUser = ({ senderId, receiverId, offer, callType }) => {
  socket.emit("callUser", { senderId, receiverId, offer, callType });
};

// ------------------
// Answer call
// ------------------
export const answerCall = ({ senderId, receiverId, answer }) => {
  socket.emit("answerCall", { senderId, receiverId, answer });
};

// ------------------
// Send ICE candidate
// ------------------
export const sendIceCandidate = ({ receiverId, candidate }) => {
  // 🔥 Must send in same shape backend expects
  socket.emit("iceCandidate", { receiverId, candidate });
};

// ------------------
// End call
// ------------------
export const endCall = ({ senderId, receiverId }) => {
  socket.emit("endCall", { senderId, receiverId });
};

// ------------------
// Listeners
// ------------------
export const onIncomingCall = (callback) => {
  socket.on("incomingCall", callback);
};

export const onCallAnswered = (callback) => {
  socket.on("callAnswered", callback);
};

export const onIceCandidate = (callback) => {
  socket.on("iceCandidate", callback); // emits { candidate }
};

export const onCallEnded = (callback) => {
  socket.on("callEnded", callback);
};
