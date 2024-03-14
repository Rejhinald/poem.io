import axios from 'axios';

const loginAPI = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/user/login/', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default loginAPI;