import axios from 'axios';

export const getUserInfo = async (token) => {
    const config = {
        headers: { Authorization: `Token ${token}` }
    };

    try {
        const response = await axios.get('http://localhost:8000/api/v1/user/user', config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
