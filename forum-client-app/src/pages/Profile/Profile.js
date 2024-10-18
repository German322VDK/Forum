import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddUserImage from './components/AddUserImage'
import SetNickName from './components/SetNickName';
import {AutHeader, getUser, getToggleResult} from '../../utils';
import {gerUserUrl} from '../../urls';
import './profile.css';

const Profile = () => {
    const { id } = useParams(); // Получаем id из URL
    const [userData, setUserData] = useState(null);

    const setImage = (image)=>{
        setUserData(prevState => ({
            ...prevState,
            image: image // Обновляем только поле image
        }));
    };

    const setNickName = (nickname)=>{
        setUserData(prevState => ({
            ...prevState,
            nickName: nickname // Обновляем только поле image
        }));
    };

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const headers = AutHeader();
                const response = await fetch(gerUserUrl(userId || '-1'),{
                    method: 'GET',
                    headers
                });
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        fetchUserData(id); // Если id есть, загружаем данные пользователя по id, иначе загружаем свои
    }, [id]);

    if (!userData) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Профиль пользователя</h2>

            <div className="profile-picture">
                <img
                    src={`data:image/${userData.image.imageExtension};base64,${userData.image.imageData}`}
                    alt={userData.image.imageName}
                    className="profile-img"
                />
                {userData.isAuthor && (
                    <div>
                        <AddUserImage setProfileImage={setImage}/>
                    </div>
                )}
            </div>

            <div className="profile-info">
                <h3>Логин: {userData.userName}</h3>
                <h3>Имя пользователя: {userData.nickName}</h3>
                {userData.isAuthor && (
                    <div>
                        <SetNickName setProfileNickName={setNickName}/>
                    </div>
                )}
            </div>

            <div className="additional-info">
                <h4>Количество постов: {userData.postsCount}</h4>
                <h4>Количество комментариев: {userData.commentsCount}</h4>
                <h4>Количество тредов: {userData.tradsCount}</h4>
            </div>
        </div>
    );
};

export default Profile;
