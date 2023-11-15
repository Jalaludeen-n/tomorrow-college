import axios from "axios";
import { handleError, handleSuccess } from "./exceptions";
const api_url = process.env.REACT_APP_API_URL;

export const fetchRoundPdf = async (data) => {
  try {
    const response = await axios.get(`${api_url}/level/pdf`, {
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

export const startLevel = async (formattedData) => {
  try {
    const response = await axios.post(`${api_url}/level/start`, formattedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    handleSuccess(response, "Level started ");
  } catch (error) {
    handleError(error);
  }
};
export const getLevelStatus = async (data) => {
  try {
    const response = await axios.get(`${api_url}/level/current-status`, {
      params: data,
      responseType: "json",
    });

    return handleSuccess(response, "Level fetched");
  } catch (error) {
    handleError(error);
  }
};

export const updateLevel = async (data) => {
  try {
    const response = await axios.patch(`${api_url}/level/update`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleSuccess(response, "Level updated");
  } catch (error) {
    handleError(error);
  }
};
