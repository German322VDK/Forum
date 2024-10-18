import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {loginUrl, registerUrl} from '../../urls';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('login'); // Статус текущей вкладки
    // Обработчик переключения вкладок
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Вход в систему</h1>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => handleTabChange('login')}
                        role="tab"
                    >
                        Вход
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => handleTabChange('register')}
                        role="tab"
                    >
                        Регистрация
                    </a>
                </li>
            </ul>

            <div className="tab-content mt-4">
                {/* Вкладка Вход */}
                {activeTab === 'login' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                        <LoginForm />
                    </div>
                )}

                {/* Вкладка Регистрация */}
                {activeTab === 'register' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                        <RegisterForm />
                    </div>
                )}
            </div>
        </div>
    );
}

const LoginForm = () => {
    const [username, setUsername] = useState(''); // Хранит логин
    const [password, setPassword] = useState(''); // Хранит пароль
    const navigate = useNavigate();

    const handleLogin = async () => {
        const credentials = {
            "userName": username,
            "password": password,
        };
        let logindata = JSON.stringify(credentials);

        try {
            const response = await fetch(loginUrl(), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: logindata,
            });

            if (response.ok) {
                // Успешный ответ
                const data = await response.json();

                const { token, id, userName, nickName } = data;
                const user = {
                    id: id,
                    name: userName,
                    nickName: nickName,
                    isAuthenticated: true,
                    token: token,
                };

                console.log('Успешный вход:', data);

                localStorage.setItem('user', JSON.stringify(user));
                // Здесь можно добавить обработку успешного входа
                navigate('/');

            } else {
                // Обработка ошибок
                console.error('Ошибка входа:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };


    return (
        <section>
            <div className="reg-form ">
                <h2 className="text-center">Login</h2>
                <div className="form-group">
                    <label htmlFor="login-username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="login-username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="login-password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="login-password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button className="btn btn-primary btn-block"
                    onClick={handleLogin}>
                    Login
                </button>
            </div>

        </section>
    );
};

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfirm, setPasswordconfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        setErrorMessage('');

        if (password !== passwordconfirm) {
            setErrorMessage('Пароли не совпадают!');
            return; // Прекращаем выполнение, если пароли не совпадают
        }

        const credentials = {
            "userName": username,
            "password": password,
            "nickName": nickname,
            "passwordConfirm": passwordconfirm
        };
        let logindata = JSON.stringify(credentials);

        try {
            const response = await fetch(registerUrl(), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: logindata,
            });

            if (response.ok) {
                // Успешный ответ
                const data = await response.json();

                const { token, id, userName, nickName } = data;
                const user = {
                    id: id,
                    name: userName,
                    nickName: nickName,
                    isAuthenticated: true,
                    token: token,
                };

                console.log('Успешный вход:', data);

                localStorage.setItem('user', JSON.stringify(user));
                // Здесь можно добавить обработку успешного входа
                navigate('/');

            } else {
                // Обработка ошибок
                console.error('Ошибка входа:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка сети:', error);
        }

    };
    return (
        <section>
            <h2 className="text-center">Регистрация</h2>
            <div className="reg-form ">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="form-group">
                    <label htmlFor="username">Логин пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        name="userName"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="nickname">Имя пользователя:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickName"
                        className="form-control"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordconfirm">Подтвердите пароль:</label>
                    <input
                        type="password"
                        id="passwordconfirm"
                        name="passwordConfirm"
                        className="form-control"
                        value={passwordconfirm}
                        onChange={(e) => setPasswordconfirm(e.target.value)}
                        required />
                </div>
                <button onClick={handleRegister}
                    className="btn btn-success btn-block">
                    Регистрация
                </button>
            </div>
        </section>
    );
};

export default LoginPage;
