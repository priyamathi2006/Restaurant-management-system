import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId, role) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "https://restaurant-management-system-2-kbv1.onrender.com");
    console.log("Websocket connected to backend");

    if (userId) {
      socket.emit("join", userId);
    }

    if (role && ["Admin", "Chef", "Delivery", "Cashier"].includes(role)) {
      socket.emit("joinStaff");
    }
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Websocket disconnected");
  }
};
