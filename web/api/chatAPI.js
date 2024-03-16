import axios from 'axios';

export const getSingleChat = async (id, token) => {
    const response = await axios.get(`http://localhost:8000/api/v1/chats/user/${id}/`, {
        headers: { Authorization: `Token ${token}` },
    });
    return response.data;
};

export const getUserChats = async (token) => {
    const response = await axios.get('http://localhost:8000/api/v1/chats/user/', {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
};
