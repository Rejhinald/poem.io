"use client";
import React, { useEffect, useState } from 'react';
import styles from '@/styles/login.module.css';
import loginAPI from '@/api/loginAPI';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/chat'); // Redirect to /chat if user is logged in
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    const data = await loginAPI(email, password);
    if (data) {
      // Handle successful login here
      console.log(data);
      localStorage.setItem('token', data.token);
      window.localStorage.setItem('login', Date.now().toString()); // New line
      router.push('/chat');
      setTimeout(() => {
        window.location.reload(); // Force a page refresh
      }, 100); //
      
    } else {
      // Handle failed login here
      setError("Email and password didn't match, please try again.");
      setLoading(false); // Set loading to false if login failed
    }
  };

  const handleRegister = () => {
    router.push('/register'); // Navigate to /register
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>Logging in...</div> // Display loading message if loading
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Login</button><br></br>
          <p>Don't have an account yet? <span onClick={handleRegister} style={{cursor: 'pointer', textDecoration: 'underline'}}>Register here</span>.</p> {/* Add registration link */}
        </form>
      )}
    </div>
  );
};

export default Login;
