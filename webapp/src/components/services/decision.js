import axios from "axios";
import { handleError, handleSuccess } from "./exceptions";
const api_url = process.env.REACT_APP_API_URL;

export const fetchQustions = async (data) => {
  try {
    const response = await axios.get(`${api_url}/decision-form/questions`, {
      params: data,
      responseType: "json",
    });
    return handleSuccess(
      response,
      "Roles and participants fetched successfully",
    );
  } catch (error) {
    handleError(error);
  }
};
