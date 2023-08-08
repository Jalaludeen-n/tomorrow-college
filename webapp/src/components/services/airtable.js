import axios from 'axios';

const BASE_ID = 'appOCjgYIxKJpDucO';
const AIRTABLE_API_KEY = 'pat5q13YW9Degp4nt.a74e3f8f62fca6465c18a52c9584830cb731de27706afe6a1388542c31452a7c';
const TABLE_NAME = 'Level';

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const sendDataToAirtable = async (formattedData) => {
    try {
        const response = await fetch(AIRTABLE_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ records: formattedData }),
        });
    
        if (response.ok) {
          console.log("Data sent successfully!" + response);
        } else {
          console.error("Error sending data to Airtable:", response.statusText);
const responseBody = await response.json();
console.error("Response body:", responseBody);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
};

export default sendDataToAirtable;
