// utils.js
export const generateSampleGameData = (count) => {
  const sampleGameData = [];

  for (let i = 1; i <= count; i++) {
    sampleGameData.push({
      GameName: `Game ${i}`,
      Date: "July 20, 2023",
      players: Math.floor(Math.random() * 50) + 1,
    });
  }

  return sampleGameData;
};

export const generateRoomID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
};
