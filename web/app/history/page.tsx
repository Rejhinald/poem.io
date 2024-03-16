"use client";
import { useEffect, useState } from 'react';
import { getUserChats } from '@/api/chatAPI';
import { getUserInfo } from '@/api/userInfoAPI';
import styles from '@/styles/ChatHistory.module.css';

interface User {
    email: string;
}

interface Chat {
    user: User;
    created_at: string;
    message: string;
}

interface ChatHistoryProps {
    onSelectChat: (chat: Chat) => void;
}

export default function ChatHistory({ onSelectChat }: ChatHistoryProps) {
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

    return (
        <div className={styles.chatHistory}>
          {chats.map((chat: Chat, i: number) => (
            <div key={i}>
              <div className={styles.chatHeader}>Poem.io {new Date(chat.created_at).toLocaleString()}</div>
              <div className={styles.chatMessage}>{chat.message}</div>
            </div>
          ))}
        </div>
      );
    }
