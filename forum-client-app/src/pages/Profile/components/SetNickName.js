import React, { useState } from 'react';
import { getToken } from '../../../utils';
import {setUserNickNameUrl} from '../../../urls'

function SetNickName({ setProfileNickName }) {
    // Состояние для управления видимостью блока смены изображения
    const [isSetNickVisible, setNickVisible] = useState(false);
    const [nickname, setNickname] = useState(''); // Для хранения изображения

    // Функция для переключения видимости блока
    const toggleImageUploader = () => {
        setNickVisible(!isSetNickVisible);
    };

    const SetNickName = async () => {

        if(nickname == null || nickname == '')
            return;

        try {
            const token = getToken();

            const response = await fetch(setUserNickNameUrl(nickname), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении поста');
            }

            setProfileNickName(nickname);
            setNickname('');
        } catch (error) {
            console.error('Ошибка при добавлении Коммент:', error);
        }
    };


    return (
        <div>
            <button
                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button toggle-comments-btn"
                onClick={toggleImageUploader}
            >
                <i className="fas fa-plus"></i>
                <span className="ml-1">Сменить имя пользователя</span>
            </button>

            {isSetNickVisible && (
                <div className="post-form addContent">
                    <h2>Сменить имя пользователя</h2>

                    <div>

                        <div>
                            <textarea
                                className="trad-textarea"
                                name="text"
                                placeholder="никнейм"
                                value={nickname} // Привязываем значение текстового поля к состоянию
                                onChange={(e) => setNickname(e.target.value)} // Обновляем состояние при вводе текста
                            />
                            <button onClick={SetNickName}
                                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button"
                            >
                                <i className="fas fa-plus"></i>
                                <span className="ml-1">Сменить имя пользователя</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SetNickName;
