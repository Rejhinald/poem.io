"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo } from '../api/userInfoAPI';
import logoutAPI from '../api/logoutAPI';
import styles from '../styles/navbar.module.css';

type User = {
  email: string;
  [key: string]: any;
};

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const syncLogin = (event: StorageEvent) => {
        if (event.key === 'login') {
          console.log('logged in from storage!');
          const storedToken = localStorage.getItem('token');
          setToken(storedToken);
          if (storedToken) {
            getUserInfo(storedToken).then(setUser); // Fetch user info here
          }
        }
      };
  
      window.addEventListener('storage', syncLogin);
      return () => {
        window.removeEventListener('storage', syncLogin);
      };
    }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      getUserInfo(storedToken).then(setUser);
    }
  }, [token]); // Add token as a dependency

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        setUser(null);
        setToken(null);
      }
    };
  
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, []);

  const handleLogout = () => {
    if (token) {
      logoutAPI(token).then(success => {
        if (success) {
          setUser(null);
          localStorage.removeItem('token');
          setToken(null);
          router.push('/');
          window.localStorage.setItem('logout', Date.now().toString()); // New line
        } else {
          console.log('Logout failed');
        }
      });
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Logo</div>
      <div className={styles['user-info']}>
        {user ? (
          <>
            <div className={styles.email}>{user.email}</div>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </div>
  );
}
