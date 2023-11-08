export const handleSuccess = (response, successMessage) => {
  if (response.status === 200 && response.data.success) {
    console.log(successMessage);
  } else {
    console.error(response.message);
  }
  return response.data;
};

export const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};
