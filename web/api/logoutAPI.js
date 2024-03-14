import axios from 'axios';

const logoutAPI = async (token) => {
  try {
    await axios.post('http://localhost:8000/api/v1/user/logout/', {}, {
      headers: { Authorization: `Token ${token}` }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default logoutAPI;