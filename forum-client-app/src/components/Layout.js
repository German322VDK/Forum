import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import {tradsAllRefUrl} from '../urls';
import '../assets/css/bootstrap.min.css'; // Стили для header
import '../assets/css/site.css';

function Layout({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const [trads, setTrads] = useState([]);

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
        // Обновляем результаты поиска при изменении query
        if (searchQuery.length >= 2) {
            const results = searchTrads(searchQuery);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        // Устанавливаем ширину результатов поиска при загрузке и изменении размера окна
        setSearchResultsWidth();
        window.addEventListener('resize', setSearchResultsWidth);
        return () => window.removeEventListener('resize', setSearchResultsWidth);
    }, []);

    const searchTrads = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        return trads.filter(trad => trad.title.toLowerCase().includes(lowerCaseQuery));
    };


    const handleClear = () => {
        setSearchQuery('');
        setShowClearButton(false);
        setSearchResults([]);
    };

    const setSearchResultsWidth = () => {
        const basicAddon1 = document.getElementById('basic-addon1');
        const searchResultsElem = document.getElementById('searchResults');
        const computedStyle = window.getComputedStyle(basicAddon1);
        const offset = parseFloat(computedStyle.width);

        // Устанавливаем ширину и смещение
        searchResultsElem.style.width = document.getElementById('searchInputMain').offsetWidth + 'px';
        searchResultsElem.style.marginLeft = offset + 'px';
    };

    return (
        <div>
            <Header />
            <div className="container">
                <main role="main" className="pb-3 container mt-5">
                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="fas fa-search"></i>
                            </span>

                            <input id="searchInputMain"
                                className="form-control"
                                type="text"
                                placeholder="Enter thread title"
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
                                    id="clearButtonMain"
                                    className="btn btn-outline-danger small-btn clearButton"
                                    type="button"
                                    onClick={handleClear}
                                    style={{ height: '38px' }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        <div id="searchResults" className="search-results">
                            {searchResults.length > 0 ? (
                                searchResults.map(trad => (
                                    <div key={trad.id} className="search-result-item">
                                        <a href={`/trad/${trad.id}`}>{trad.title}</a>
                                    </div>
                                ))
                            ) : (
                                searchQuery.length >= 2 && <div className="text-warning">Нет результатов для данного запроса.</div>
                            )}
                        </div>
                    </div>
                    {children}
                    <button id="scroll-to-top" className="btn">
                        <i className="fas fa-chevron-up"></i>
                    </button>
                </main>
            </div>
        </div>
    );
}

export default Layout;