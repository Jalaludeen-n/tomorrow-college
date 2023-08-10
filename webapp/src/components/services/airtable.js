import axios from 'axios';

const sendDataToAirtable = async (formattedData) => {
  try {
      const response = await axios.post('http://localhost:3001/new-game',  formattedData, {
          headers: {
              "Content-Type": "multipart/form-data",
            },
      });
    } catch (error) {
      console.error('Error:', error);
    }
};

export default sendDataToAirtable;
