import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AutHeader, getToggleResult, getToken } from '../../utils';
import { tradUrl, likeTradUrl, unlikeTradUrl } from '../../urls';
import AddPost from './components/AddPost';
import Post from './Post';

const TradPage = () => {
    const { id } = useParams();
    const [trad, setTrad] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const mapTradData = (trad) => ({
        Id: trad.id || null,
        Image: trad.image || null,
        Content: trad.content || '',
        Author: trad.author || null,
        CreatedAt: trad.createdAt || 'Unknown date',
        Posts: trad.posts || [],
        LikesCount: trad.likesCount || 0,
        IsLiked: trad.isLiked || false,
    });

    const addPost = (newPost) => {
        setTrad(prevTrad => ({
            ...prevTrad,
            Posts: [...prevTrad.Posts, newPost] // Добавляем новый пост в массив
        }));
    };


    // Функция для удаления треда
    const deleteTrad = async () => {
        const token = getToken();
        try {
            const tradId = id;
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
            if (result) {
                console.log('удаление трэда');
                navigate('/');
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    const deletePost = (postId) => {
        setTrad(prevTrad => ({
            ...prevTrad,
            Posts: prevTrad.Posts.filter(post => post.id !== postId) // Добавляем новый пост в массив
        }));
    };

    // Функция для переключения лайка
    const toggleLike = async () => {
        if (!trad)
            return;

        const route = trad.IsLiked
            ? unlikeTradUrl(trad.Id)
            : likeTradUrl(trad.Id);

        const result = await getToggleResult(route);

        if (result) {
            setTrad(prevTrad => ({
                ...prevTrad,
                IsLiked: !prevTrad.IsLiked,
                LikesCount: prevTrad.IsLiked ? prevTrad.LikesCount - 1 : prevTrad.LikesCount + 1
            }));
        }
    };

    useEffect(() => {
        // Функция для загрузки данных о треде
        const fetchTrad = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                const headers = AutHeader();
                const response = await fetch(tradUrl(id), {
                    method: 'GET',
                    headers
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const tradData = mapTradData(data);
                setTrad(tradData);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchTrad();
    }, [id]);


    if (!trad) {
        return <div>Loading...</div>;
    }

    return (
        <div className="thread-container">
            <h1 className="trad-h1">Тред: {trad.Content}</h1>
            <div>
                <span className="post-author">
                    <a href={`/profile/${trad.Author.id}`} className="text-dark">
                        <img
                            src={`data:image/${trad.Author.image.imageExtension};base64,${trad.Author.image.imageData}`}
                            alt={trad.Author.image.imageName}
                            className="mini-user-image"
                        />
                        {trad.Author.nickName}
                    </a>
                </span>
                <div className="thread-stats d-flex justify-content-start mt-2">
                    <span className="mr-3">
                        <i className="fas fa-id-badge"></i> {trad.Id}
                    </span>
                    <span className="mr-3">
                        <i className="fas fa-clock"></i> {trad.CreatedAt}
                    </span>
                    <span className="mr-3">
                        <i className="fas fa-comments"></i> {trad.Posts.length} posts
                    </span>
                    <span>
                        <i className="fas fa-thumbs-up"></i> <span>{trad.LikesCount}</span> likes
                    </span>
                </div>
                {user && (
                    <div className="thread-meta d-flex align-items-center mt-3">
                        <div className="ml-auto d-flex">
                            <button
                                onClick={toggleLike}
                                className={`btn btn-xs d-flex align-items-center mr-2 small-btn ${trad.IsLiked ? "btn-outline-primary-mh" : "btn-outline-primary-m"}`}
                            >
                                <i className="fas fa-thumbs-up"></i> <span className="ml-1">Like</span>
                            </button>
                            {trad.Author.id === user.id && (
                                <button
                                    onClick={deleteTrad}
                                    className="btn btn-xs btn-outline-danger d-flex align-items-center small-btn"
                                >
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {trad.Image && (
                <div className="wrapper">
                    <div className="image-container image-container-trad">
                        <img className="mr-3" src={`data:image/${trad.Image.imageExtension};base64,${trad.Image.imageData}`} alt={trad.Image.imageName} />
                    </div>
                </div>
            )}
            {user && <AddPost tradId={trad.Id} addPost={addPost} />}
            <div className="thread-list">
                <div className="posts">
                    {trad.Posts.map(post => (
                        <Post key={post.id} initialPost={post} user={user} deletePost={deletePost} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TradPage;
