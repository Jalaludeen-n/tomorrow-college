import CryptoJS from "crypto-js";

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

export function getDataFromURL(location) {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get("data");
}
export const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export const encryptData = (data, encryptionKey) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      encryptionKey,
    ).toString();
    return encryptedData;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
};
export function setLocalStorageItem(key, data) {
  try {
    localStorage.setItem(key, data);
  } catch (e) {
    console.error("Error storing data in localStorage:", e);
  }
}
export function getLocalStorageItem(key) {
  try {
    const data = localStorage.getItem(key);
    if (data !== null) {
      return data;
    }
  } catch (e) {
    console.error("Error retrieving data from localStorage:", e);
  }
  return false;
}
