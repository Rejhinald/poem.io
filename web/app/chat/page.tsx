"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { generatePoem } from '@/api/poemAPI';
import { getUserInfo } from '@/api/userInfoAPI';
import styles from '@/styles/PoemGenerator.module.css';


export default function PoemGenerator() {
  const [mood, setMood] = useState<string>('happy');
  const [recipient, setRecipient] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserInfo(storedToken).then(userInfo => console.log(userInfo));
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (token) {
      const generatedPoem = await generatePoem(mood, recipient, token);

      setPoem(generatedPoem);
      setLoading(false);
      setTime(new Date().toLocaleString());
    } else {
      // Handle case where there is no token
      console.log('No token found');
    }
  };

  // Split the poem into stanzas
  const stanzas = poem.split('\n\n');

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {poem && 
          <div>
            <div className={styles.poemHeader}>Poem.io {time}</div>
            <div className={styles.poemMessage}>
              {stanzas.map((stanza, i) => <p key={i}>{stanza}</p>)}
            </div>
          </div>
        }
      </div>
      <form className={styles.chatInput} onSubmit={handleSubmit}>
        <input 
          className={styles.input}
          type="text"
          placeholder={`Write a poem to ${recipient}`}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
        />
        <select 
          className={styles.input}
          value={mood} 
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setMood(e.target.value)}
        >
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          {/* Add more options here */}
        </select>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Poem'}
        </button>
      </form>
    </div>
  );
}
