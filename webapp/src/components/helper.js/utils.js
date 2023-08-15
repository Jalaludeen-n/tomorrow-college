// utils.js
export const generateSampleGameData = (count) => {
  const sampleGameData = [];

  for (let i = 1; i <= count; i++) {
    sampleGameData.push({
      name: `Game ${i}`,
      date: "July 20, 2023",
      players: Math.floor(Math.random() * 50) + 1,
    });
  }

  return sampleGameData;
};
