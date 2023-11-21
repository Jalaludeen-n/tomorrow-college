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
export const fetchResults = async (data) => {
  try {
    const response = await axios.get(`${api_url}/decision-form/results`, {
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
export const fetchIndividualResultPdf = async (data) => {
  try {
    const response = await axios.get(
      `${api_url}/decision-form/individual-result`,
      {
        params: data,
        responseType: "json",
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
      `${api_url}/decision-form/answeres`,
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
export const fetchResultPdf = async (data) => {
  try {
    const response = await axios.get(`${api_url}/decision-form/result`, {
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
