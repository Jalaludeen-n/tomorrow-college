// src/components/UpdateValueButton.js
import React, { useEffect } from 'react';
import axios from 'axios';
import con from "./../cred.json"

const backendUrl = 'http://localhost:3000'; // Replace with your actual backend URL

const UpdateValueButton = () => {
 
  // Load the Google API client and authenticate with the service account
  useEffect(() => {
  
  }, []);
  const handleUpdateSheet = async () => {
    const airtableUrl = `https://api.airtable.com/v0/appOCjgYIxKJpDucO/Game`;
    const headers = {
      Authorization: `Bearer patvFZAuVZVpmQ2nv.97e6637553b89858adceae664fb4d3458eafe6ce7eafe32e65fb7b5ac464209b`,
    };
  
    try {
      const response = await axios.get(airtableUrl, { headers });
      const data = response.data;
      console.log(data); // Do something with the data
    } catch (error) {
      console.error('Error fetching data from Airtable:', error);
    }
  }

  return <button onClick={handleUpdateSheet}>Update Value</button>;
};

export default UpdateValueButton;
