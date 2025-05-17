const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test the API
async function testAPI() {
  try {
    console.log('Testing API status...');
    const statusResponse = await axios.get(`${API_URL}/status`);
    console.log('Status response:', statusResponse.data);

    console.log('\nTesting prasadam info endpoint...');
    const prasadamInfoResponse = await axios.get(`${API_URL}/prasadam/info`);
    console.log('Prasadam info response:', prasadamInfoResponse.data);

    console.log('\nTesting prasadam endpoint...');
    const prasadamResponse = await axios.get(`${API_URL}/prasadam`);
    console.log(`Found ${prasadamResponse.data.length} prasadam days`);
    console.log('First prasadam day:', prasadamResponse.data[0].dayOfWeek);

    console.log('\nTesting temple info endpoint...');
    const templeResponse = await axios.get(`${API_URL}/temple`);
    console.log('Temple info response:', templeResponse.data.name);

    console.log('\nAll tests passed successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    }
  }
}

// Run the tests
testAPI(); 