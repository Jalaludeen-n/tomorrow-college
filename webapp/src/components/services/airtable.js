import axios from "axios";
import { handleError, handleSuccess } from "./exceptions";
const api_url = process.env.REACT_APP_API_URL;

export const fetchGameData = async () => {
  try {
    const response = await axios.get(`${api_url}/game/list`);
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
    const response = await axios.get(`${api_url}/game/running`, {
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
export const fetchRemainingRoles = async (data) => {
  try {
    const response = await axios.get(`${api_url}/game/roles`, {
      params: data,
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

export const fetchMember = async (data) => {
  try {
    const response = await axios.post(`${api_url}/game/member`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
export const fetchScore = async (data) => {
  try {
    const response = await axios.post(`${api_url}/game/score`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export const fetchGroupDetails = async (data) => {
  try {
    const response = await axios.get(`${api_url}/game/group-status`, {
      params: data,
      responseType: "json",
    });

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
    const response = await axios.post(`${api_url}/game/details`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleSuccess(response, "Game details fetched successfully");
  } catch (error) {
    handleError(error);
  }
};

export const gameCompleted = async (data) => {
  try {
    const response = await axios.post(`${api_url}/game/over`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleSuccess(response, "Game successfully completed");
  } catch (error) {
    handleError(error);
  }
};
export const fetchRolesAndParticipants = async (data) => {
  try {
    const response = await axios.post(`${api_url}/game/players`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleSuccess(
      response,
      "Roles and participants fetched successfully",
    );
  } catch (error) {
    handleError(error);
  }
};

export const sendGameData = async (formattedData) => {
  try {
    const response = await axios.post(`${api_url}/game/new`, formattedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    handleSuccess(response, "Game data sent to Airtable");
  } catch (error) {
    handleError(error);
  }
};

export const joinGame = async (formattedData) => {
  try {
    const response = await axios.post(`${api_url}/game/join`, formattedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleSuccess(response, "Joined the game successfully");
  } catch (error) {
    handleError(error);
  }
};

export const startGame = async (formattedData) => {
  try {
    const response = await axios.post(`${api_url}/game/start`, formattedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    handleSuccess(response, "game started");
  } catch (error) {
    handleError(error);
  }
};

export const selectRole = async (formattedData) => {
  try {
    const response = await axios.post(
      `${api_url}/game/select-role`,
      formattedData,
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
