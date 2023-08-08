import axios from 'axios';

const airtableService = {
  async createGame(gameData) {
    try {
      const response = await axios.post('/api/airtable/create-game', gameData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // ...other methods
};

export default airtableService;
