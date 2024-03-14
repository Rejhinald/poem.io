import axios from 'axios';

export async function generatePoem(mood, recipient, token) {
  const prompt = `Generate a ${mood} poem for ${recipient}. Limit your stanzas to four. Kindly include the reciepient's name in the poem. No title needed.`;
  const response = await axios.post(
    'http://localhost:8000/api/v1/chats/create/',
    { prompt },
    { headers: { Authorization: `Token ${token}` } }
  );

  return response.data.response;
}
