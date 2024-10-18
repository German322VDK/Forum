import React, { useState, useEffect, useContext } from 'react';
import AddTrad from '../Trad/components/AddTrad';
import {AutHeader, getUser, getToggleResult} from '../../utils';
import {tradsAllShortUrl, tradUrl, likeTradUrl, unlikeTradUrl} from '../../urls';

const HomePage = () => {
    const [trads, settrads] = useState([]);
    const [user, setUser] = useState(null);

    const mapTradData = (trad) => ({
        Id: trad.id || null,
        Image: trad.image || null,
        Content: trad.content || '',
        Author: trad.author || null,
        CreatedAt: trad.createdAt || 'Unknown date',
        PostsCount: trad.postsCount || 0,
        CommentsCount: trad.commentsCount || 0,
        LikesCount: trad.likesCount || 0,
        IsLiked: trad.isLiked || false,
    });

    const addTrad = (newTrad) => {
        const mappedTrad = mapTradData(newTrad);
        settrads((prevTrads) => [mappedTrad, ...prevTrads]);
    };

    const deleteTrad = async(tradId)=>{
        const token = user.token;
        if(token == null){
            console.log('token=null');
            return;
        }
        try{
            const response = await fetch(tradUrl(tradId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                  }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if(result){
                console.log('удаление трэда');
                settrads(prevTrads => prevTrads.filter(el => el.Id !== tradId));
            }

        }catch(error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const toggleLike = async (tradId) => {
        const trad = trads.find(el => el.Id === tradId);
        if (!trad) 
            return;
        
        const route = trad.IsLiked
            ? unlikeTradUrl(tradId)
            : likeTradUrl(tradId);
    
        const result = await getToggleResult(route);
    
        if (result) {
            settrads(prevTrads =>
                prevTrads.map(el =>
                    el.Id === tradId
                        ? { ...el, IsLiked: !el.IsLiked, LikesCount: el.IsLiked ? el.LikesCount - 1 : el.LikesCount + 1 }
                        : el
                )
            );
        }
    };

    useEffect(() => {
        const fetchtrads = async () => {
            setUser(getUser());
            try {
                const headers = AutHeader();
                const response = await fetch(tradsAllShortUrl(),{
                    method: 'GET',
                    headers
                }); // Замените на ваш URL API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json(); // Получаем данные в формате JSON
                const trads = data.map(mapTradData);
                settrads(trads); // Обновляем состояние с полученными потоками
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchtrads(); // Вызываем функцию для получения потоков
    }, []); // Пустой массив зависимостей означает, что useEffect выполнится один раз после монтирования

    return (
        <div>
            {user !=null && <AddTrad addTrad={addTrad} />}
            <h2>Трэды</h2>

            <div className="thread-list">
                {trads.map(trad => (
                    <div key={trad.Id} className="thread-item d-flex align-items-start mb-4 p-3 border rounded">
                        {trad.Image && (
                            <img
                                className="thread-image mr-3"
                                src={`data:image/${trad.Image.imageExtension};base64,${trad.Image.imageData}`}
                                alt={trad.Image.imageName}
                            />
                        )}

                        <div className="thread-content flex-grow-1">
                            <h4 className="thread-title">
                                <a href={`/trad/${trad.Id}`} className="text-dark thread-link">Id: {trad.Id}</a>
                            </h4>
                            <p className="thread-description text-muted">{trad.Content}</p>

                            <div className="thread-stats d-flex justify-content-start mt-2">
                                <span className="mr-3">
                                    <a href={`/profile/${trad.Author.id}`} className="text-dark">
                                        <img
                                            src={`data:image/${trad.Author.image.imageExtension};base64,${trad.Author.image.imageData}`}
                                            alt={trad.Author.image.imageName}
                                            className="mini-user-image"
                                        />
                                        {trad.Author.nickName}
                                    </a>
                                </span>
                                <span className="mr-3">
                                    <i className="fas fa-clock"></i> {trad.CreatedAt}
                                </span>
                                <span className="mr-3">
                                    <i className="fas fa-comments"></i> {trad.PostsCount} posts
                                </span>
                                <span className="mr-3">
                                    <i className="fas fa-comment-dots"></i> {trad.CommentsCount} comments
                                </span>
                                <span>
                                    <i className="fas fa-thumbs-up"></i> {trad.LikesCount} likes
                                </span>
                            </div>

                            {user != null && (
                                <div className="thread-meta d-flex align-items-center mt-3">
                                    <div className="ml-auto d-flex">
                                        <button onClick={() => toggleLike(trad.Id)}
                                            className={`btn btn-xs d-flex align-items-center mr-2 small-btn ${trad.IsLiked ? "btn-outline-primary-mh" : "btn-outline-primary"}`}>
                                            <i className="fas fa-thumbs-up"></i> <span className="ml-1">Like</span>
                                        </button>

                                        {user.id === trad.Author.id && (
                                            <button onClick={() => deleteTrad(trad.Id)}
                                            className="btn btn-xs btn-outline-danger d-flex align-items-center small-btn">
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;

