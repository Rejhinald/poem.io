"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { generatePoem } from "@/api/poemAPI";
import { getUserInfo } from "@/api/userInfoAPI";
import { Box, TextField, Typography, Avatar, CircularProgress, IconButton, Skeleton, Autocomplete } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Tooltip from "@mui/material/Tooltip";

export default function PoemGenerator() {
  const [mood, setMood] = useState<string>("Happy");
  const [recipient, setRecipient] = useState<string>("");
  const [poem, setPoem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'poem', text: string, time: string }>>([]);

//test 4
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserInfo(storedToken).then((userInfo) => {
        setUserInfo(userInfo);
      });
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    const userMessage = `Generate a ${mood} poem for ${recipient}. Limit your stanzas to four. Kindly include the recipient's name in the poem. No title needed.`;
    setMessages([...messages, { type: 'user', text: userMessage, time: new Date().toLocaleString() }]);
  
    if (token) {
      const generatedPoem = await generatePoem(mood, recipient, token);
      setMessages([...messages, { type: 'user', text: userMessage, time: new Date().toLocaleString() }, { type: 'poem', text: generatedPoem, time: new Date().toLocaleString() }]);
      setLoading(false);
    } else {
      console.log("No token found");
    }
  };
  

  const stanzas = poem.split("\n\n");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, borderBottom: "1px solid #ddd", textAlign: "left" }}>
        {messages.map((message, i) => (
          <Box key={i} sx={{ display: "flex", flexDirection: message.type === 'user' ? "row-reverse" : "row", alignItems: "center", my: 1 }}>
            <Avatar>{message.type === 'user' ? (userInfo ? userInfo.email.charAt(0).toUpperCase() : "U") : "P"}</Avatar>
            <Tooltip title={message.time} arrow>
              <Box sx={{ backgroundColor: message.type === 'user' ? "#007BFF" : "#f9f9f9", borderRadius: 1, p: 2, mx: 1, color: message.type === 'user' ? "#fff" : "#000", maxWidth: "70%" }}>
                <Typography>{message.text}</Typography>
              </Box>
            </Tooltip>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={400} height={118} sx={{ mx: 1 }} />
          </Box>
        )}
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", p: 2, backgroundColor: "#f9f9f9", position: "sticky", bottom: 0 }}>
        <TextField variant="outlined" placeholder={`Write a poem to ${recipient}`} onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)} sx={{ flexGrow: 1, mr: 1 }} />
        <Autocomplete value={mood} onChange={(_, newValue) => { if (newValue) { setMood(newValue); } }} options={["Happy", "Sad", "Calm", "Sentimental", "Hopeful", "Lighthearted", "Humorous", "Optimistic", "Anger", "Mysterious", "Flirty", "Endearing", "Lovely", "Funny", "Fear", "Melancholy", "Che"]} renderInput={(params) => (<TextField {...params} label="Mood" variant="outlined" />)} sx={{ mr: 1 }} />
        <IconButton type="submit" color="primary">{loading ? <CircularProgress size={24} /> : <SendIcon />}</IconButton>
      </Box>
    </Box>
  );
}