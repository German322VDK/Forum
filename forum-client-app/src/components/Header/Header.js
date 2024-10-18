import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {tradsAllRefUrl, usersAllRefUrl} from '../../urls'
import './header.css'; // Стили для header

function Header() {
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const [searchType, setSearchType] = useState('trad'); // По умолчанию ищем треды
    const [customSelectOpen, setCustomSelectOpen] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false); // Для отображения результатов поиска

    const [trads, setTrads] = useState([]);
    const [users, setUsers] = useState([]);

    const search = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        if (searchType === 'trad') {
            return trads.filter(trad => trad.title.toLowerCase().includes(lowerCaseQuery));
        } else if (searchType === 'profile') {
            return users.filter(user => user.userName.toLowerCase().includes(lowerCaseQuery));
        }
    };

    useEffect(() => {
        // Получаем данные из API
        const fetchTrads = async () => {
            try {
                const response = await fetch(tradsAllRefUrl());
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTrads(data); // Сохраняем данные в состоянии
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchTrads();
    }, []);

    useEffect(() => {
        // Получаем данные из API
        const fetchUsers = async () => {
            try {
                const response = await fetch(usersAllRefUrl());
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data); // Сохраняем данные в состоянии
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const results = search(searchQuery);
            setSearchResults(results);
            setShowSearchResults(true); // Показываем блок результатов
        } else {
            setSearchResults([]);
            setShowSearchResults(false); // Скрываем, если запроса нет или он слишком короткий
        }
    }, [searchQuery, searchType]);

    const handleClear = () => {
        setSearchQuery('');
        setShowClearButton(false);
        setSearchResults([]);
        setShowSearchResults(false); // Скрываем результаты при очистке
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type); // Меняем тип поиска (threads или users)
        setSearchQuery('');  // Очищаем поле поиска
        setSearchResults([]); // Очищаем результаты
        setShowSearchResults(false); // Скрываем результаты
        toggleCustomSelect();
    };

    const toggleCustomSelect = () => {
        setCustomSelectOpen((prev) => !prev);
    };

    return (
        <header>
            <div className="container d-flex justify-content-between align-items-center">
                <h1>Forum</h1>
                <nav>
                    <ul className="navbar-nav d-flex flex-row">
                        <div className="d-flex align-items-center">
                            <div className="header-search">
                                <div className="input-group ml-3" style={{ width: '200px', position: 'relative' }}>
                                    <span className="input-group-text" id="basic-addon-header">
                                        <i className="fas fa-search search-icon"></i>
                                    </span>
                                    <input
                                        id="searchInputHeader"
                                        className="form-control"
                                        type="text"
                                        placeholder="Search..."
                                        aria-label="Search"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            const query = e.target.value;
                                            setSearchQuery(query);
                                            setShowClearButton(query.length > 0);
                                        }}
                                    />
                                    {showClearButton && (
                                        <button
                                            id="clearButton"
                                            className="btn btn-outline-danger small-btn clearButton"
                                            type="button"
                                            onClick={handleClear}
                                        >
                                            &times;
                                        </button>
                                    )}

                                    {/* Блок с результатами поиска */}
                                    {showSearchResults && (
                                        <div id="headerSearchResults" className="search-results"
                                             style={{
                                                 position: 'absolute',
                                                 top: '100%',
                                                 left: 0,
                                                 width: '100%',
                                                 zIndex: 1,
                                                 backgroundColor: 'white',
                                                 border: '1px solid #ddd',
                                                 borderRadius: '0 0 4px 4px',
                                                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                             }}
                                        >
                                            {searchResults.length > 0 ? (
                                                searchResults.map(result => (
                                                    <div key={result.id} className="search-result-item">
                                                        <a className='serch-a'
                                                           href={`/${searchType}/${result.id}`}>{searchType === 'trad' ? result.title : result.userName}</a>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-warning">Нет результатов для данного запроса.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="fml-3">
                                    <div className="custom-select">
                                        <button id="customSelectButton"
                                                className="custom-select-button"
                                                onClick={toggleCustomSelect}>
                                            <i className={`fas ${searchType === 'trad' ? 'fa-comments' : 'fa-user'}`}></i>
                                        </button>
                                        {customSelectOpen && (
                                            <ul id="customSelectList" className="custom-options">
                                                <li data-value="trad" onClick={() => handleSearchTypeChange('trad')}>
                                                    <i className="fas fa-comments"></i> Trads
                                                </li>
                                                <li data-value="profile" onClick={() => handleSearchTypeChange('profile')}>
                                                    <i className="fas fa-user"></i> Users
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>

                            {user == null ? (
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        <i className="fas fa-user-plus"></i> Login/Register
                                    </Link>
                                </li>
                            ) : (
                                <div className="d-flex ml-3">
                                    <li className="nav-item">
                                        <Link to={`/profile/${user.id}`} className="nav-link">
                                            <i className="fas fa-user"></i> Profile
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                                                className="nav-link"
                                                style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </button>
                                    </li>
                                </div>
                            )}
                        </div>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
