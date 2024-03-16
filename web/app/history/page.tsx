"use client";
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getUserChats } from '@/api/chatAPI';
import { getUserInfo } from '@/api/userInfoAPI';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface User {
    email: string;
}

interface Chat {
    user: User;
    created_at: string;
    prompt: string;
    message: string;
}

export default function ChatHistory() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            getUserInfo(storedToken).then(userInfo => {
                getUserChats(storedToken).then(chats => {
                    // Add the user's email to each chat
                    const chatsWithEmail = chats.map((chat: Chat) => ({
                        ...chat,
                        user: { email: userInfo.email }
                    }));
                    setChats(chatsWithEmail);
                });
            });
        }
    }, []);

    // Group chats by month
    const chatsByMonth: { [key: string]: Chat[] } = chats.reduce((groups: { [key: string]: Chat[] }, chat: Chat) => {
            const date = new Date(chat.created_at);
            const monthYearKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            if (!groups[monthYearKey]) {
                    groups[monthYearKey] = [];
            }
            groups[monthYearKey].push(chat);
            return groups;
    }, {});

    return (
            <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
                {Object.entries(chatsByMonth).map(([monthYear, chats]: [string, Chat[]], i: number) => (
                    <div key={i}>
                        <Typography variant="h6">{monthYear}</Typography>
                        {chats.map((chat: Chat, j: number) => (
                <Accordion key={j} sx={{ my: 1, bgcolor: j % 2 === 0 ? 'action.hover' : 'background.paper' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{chat.prompt}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" align="center" component="div">{chat.message.split('\n').map((line, index) => <p key={index}>{line}</p>)}</Typography>
                    <Typography variant="body2" color="textSecondary" align="center">{new Date(chat.created_at).toLocaleString()}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          ))}
        </Box>
      );
    }