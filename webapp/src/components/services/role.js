import axios from "axios";
import { handleError, handleSuccess } from "./exceptions";
const api_url = process.env.REACT_APP_API_URL;

export const fetchRolePdf = async (data) => {
  try {
    const response = await axios.get(`${api_url}/role/pdf`, {
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
