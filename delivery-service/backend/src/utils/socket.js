let io;

export const setIO = (serverIO) => {
  io = serverIO;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
