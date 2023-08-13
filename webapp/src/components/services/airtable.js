import axios from "axios";
export const fetchGameDataFromAirtable = async () => {
  try {
    const response = await axios.get("http://localhost:3001/games");
    if (response.status === 200) {
      return response.data; // Return the fetched data
    } else {
      console.error("Unexpected response:", response);
      return null; // Return null on error
    }
  } catch (error) {
    console.error("Error:", error);
    return null; // Return null on error
  }
};
export const sendDataToAirtable = async (formattedData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/new-game",
      formattedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (response.status === 200) {
      console.log("Data successfully sent to Airtable");
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const startGame = async (formattedData) => {
  try {
    console.log(formattedData);
    const response = await axios.post(
      "http://localhost:3001/start-game",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      console.log("Data successfully sent to Airtable");
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
