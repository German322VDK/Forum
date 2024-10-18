import React, { useState } from 'react';
import { getToken } from '../../../utils';
import {setUserImageUrl} from '../../../urls'

function AddUserImage({ setProfileImage }) {
    // Состояние для управления видимостью блока смены изображения
    const [isImageUploaderVisible, setImageUploaderVisible] = useState(false);
    const [image, setImage] = useState(null); // Для хранения изображения
    const [imageName, setImageName] = useState(''); // Для хранения имени изображения

    // Функция для переключения видимости блока
    const toggleImageUploader = () => {
        setImageUploaderVisible(!isImageUploaderVisible);
    };

    const SetImage = async () => {
        const formData = new FormData();
        const input = document.getElementById(`files`);
        if (input.files == null || input.files[0] == null) {
            return;
        }

        formData.append("image", input.files[0]);

        try {
            const token = getToken();

            const response = await fetch(setUserImageUrl(), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });


            if (!response.ok) {
                throw new Error('Ошибка при добавлении поста');
            }

            const newImage = await response.json(); // Предполагаем, что ваш API возвращает добавленный пост
            setProfileImage(newImage);
            deletePhoto();
            setImageName('');
            //setImageUploaderVisible(false);
        } catch (error) {
            console.error('Ошибка при добавлении Коммент:', error);
        }
    };

    // Функция для предварительного просмотра загружаемого изображения
    const previewImage = (event, imgElementId, outputElementId) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result); // Устанавливаем изображение как base64 строку
                setImageName(file.name); // Устанавливаем имя файла
            };
            reader.readAsDataURL(file);
        }
    };

    const deletePhoto = () => {
        setImage(null); // Очищаем изображение
        setImageName(''); // Очищаем имя файла

        const input = document.getElementById(`files`);
        if (input) {
            input.value = null;
        }
    };

    return (
        <div>
            <button
                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button toggle-comments-btn"
                onClick={toggleImageUploader}
            >
                <i className="fas fa-plus"></i>
                <span className="ml-1">Сменить изображение</span>
            </button>

            {isImageUploaderVisible && (
                <div className="post-form addContent">
                    <h2>Сменить изображение</h2>

                    <div>
                        {/* Превью изображения */}
                        {image && (
                            <div style={{ display: 'flex', position: 'relative' }}>
                                <img
                                    className="thread-image"
                                    src={image}
                                    alt={imageName}
                                    title={imageName}
                                />
                                <div className="del_cross1" onClick={deletePhoto}>
                                    <i className="far fa-times-circle fa-2x"></i>
                                </div>
                            </div>
                        )}
                        <div>
                            <input
                                accept="image/gif, image/jpeg, image/png"
                                type="file"
                                id="files"
                                style={{ display: 'none' }}
                                onChange={(event) => previewImage(event, 'img1', 'list1')}
                            />
                            <label htmlFor="files">
                                <i className="fa fa-picture-o fa-2x" aria-hidden="true"></i>Добавить изображение
                            </label>
                            <button onClick={SetImage}
                                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button"
                            >
                                <i className="fas fa-plus"></i>
                                <span className="ml-1">Сменить изображение</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddUserImage;
