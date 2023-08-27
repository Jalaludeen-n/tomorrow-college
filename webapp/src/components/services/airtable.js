import axios from "axios";

const handleSuccess = (response, successMessage) => {
  if (response.status === 200 && response.data.success) {
    console.log(successMessage);
  } else {
    console.error(response.message);
  }
  return response.data;
};

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const fetchGameData = async () => {
  try {
    const response = await axios.get("http://localhost:3001/game/list");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    handleError(error);
  }
};

export const fetchRunningAndPastGames = async () => {
  try {
    const response = await axios.get("http://localhost:3001/game/running", {
      responseType: "json",
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return null; // Return null on error
    }
  } catch (error) {
    console.error("Error fetching game details:", error);
  }
};

export const fetchGroupDetails = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/groups",
      data,
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
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchGameDetails = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/details",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleSuccess(response, "Game details fetched successfully");
  } catch (error) {
    handleError(error);
  }
};
export const fetchLevelDetails = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/level",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleSuccess(
      response,
      "Roles and participants fetched successfully",
    );
  } catch (error) {
    handleError(error);
  }
};
export const storeAnsweres = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/answeres",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleSuccess(
      response,
      "Roles and participants fetched successfully",
    );
  } catch (error) {
    handleError(error);
  }
};
export const fetchRolesAndParticipants = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/players",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleSuccess(
      response,
      "Roles and participants fetched successfully",
    );
  } catch (error) {
    handleError(error);
  }
};

// ... Other fetch functions ...

export const sendGameData = async (formattedData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/new",
      formattedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    handleSuccess(response, "Game data sent to Airtable");
  } catch (error) {
    handleError(error);
  }
};

export const joinGame = async (formattedData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/join",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleSuccess(response, "Joined the game successfully");
  } catch (error) {
    handleError(error);
  }
};

export const startGame = async (formattedData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/start",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    handleSuccess(response, "Role Selected successfully");
  } catch (error) {
    handleError(error);
  }
};
export const selectRole = async (formattedData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/game/select-role",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    handleSuccess(response, "Game started successfully");
  } catch (error) {
    handleError(error);
  }
};
