import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import MainPage from './pages/main';
import ClubRegistrationPage from './pages/register';
import ClubDetailPage from './pages/detail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import Navbar from './components/Navbar';

const initialClubs = [
  {
    id: 1,
    name: 'The Code Brewers',
    description: 'A club for passionate developers who love coffee and code.',
    interviewDate: '2025-03-15',
    userId: 1, // Example user ID
  },
];

const CLUBS_STORAGE_KEY = 'moari-clubs';
const USERS_STORAGE_KEY = 'moari-users';
const SESSION_STORAGE_KEY = 'moari-current-user';

function AppContent() {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState(() => {
    const storedClubs = localStorage.getItem(CLUBS_STORAGE_KEY);
    return storedClubs ? JSON.parse(storedClubs) : initialClubs;
  });

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUser]);

  const signup = (email, password) => {
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return false; // Signup failed
    }
    const newUser = { id: Date.now(), email, password };
    setUsers([...users, newUser]);
    return true; // Signup successful
  };

  const login = (email, password) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);
      return true; // Login successful
    }
    return false; // Login failed
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const addClub = (club) => {
    if (!currentUser) {
      alert("Please log in to register a club.");
      return;
    }
    const newClub = { ...club, id: Date.now(), userId: currentUser.id };
    setClubs([...clubs, newClub]);
  };

  return (
    <div>
      <Navbar currentUser={currentUser} logout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<MainPage clubs={clubs} />} />
          <Route path="/club/:id" element={<ClubDetailPage clubs={clubs} />} />
          <Route path="/login" element={<LoginPage login={login} />} />
          <Route path="/signup" element={<SignupPage signup={signup} />} />
          <Route 
            path="/register" 
            element={currentUser ? <ClubRegistrationPage addClub={addClub} /> : <LoginPage login={login} />}
          />
          <Route 
            path="/mypage" 
            element={currentUser ? <MyPage clubs={clubs} currentUser={currentUser} /> : <LoginPage login={login} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppContent;
