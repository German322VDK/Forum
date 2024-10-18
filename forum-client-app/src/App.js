import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {checkTokenUrl} from './urls';
import HomePage from './pages/Home/Home';
import TradPage from './pages/Trad/Trad';
import Profile from './pages/Profile/Profile';
import Layout from './components/Layout';
import AccountLayout from './components/AccountLayout';
import LoginPage from './pages/Login/LoginPage';

function App() {

    useEffect(() => {
        const checkToken = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    const token = user.token;
                    const response = await fetch(checkTokenUrl(token), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const isValid = await response.json(); // Получаем результат

                    if (!isValid) {
                        // Если токен недействителен, делаем логаут (например, чистим localStorage)
                        localStorage.removeItem('token');
                        console.log('Токен недействителен, выполнен логаут.');
                        window.location.href = '/';
                    }
                } catch (error) {
                    console.error('Ошибка при проверке токена:', error);
                }
            }
        };

        checkToken(); // Вызов проверки токена при загрузке приложения
    }, []);

  return (
      <Router>
            <Routes>
            <Route
                    path="/"
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/trad/:id"
                    element={
                        <Layout>
                            <TradPage  />
                        </Layout>
                    }
                />
                 <Route
                    path="/profile/:id"
                    element={
                        <Layout>
                            <Profile  />
                        </Layout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <AccountLayout>
                            <LoginPage />
                        </AccountLayout>
                    }
                />
            </Routes>
        </Router>
  );
}

export default App;
