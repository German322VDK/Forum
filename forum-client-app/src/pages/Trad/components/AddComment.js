import React, { useState } from 'react';
import {getToken} from '../../../utils';
import {addCommentUrl} from '../../../urls';

const AddComment = ({ postId, addComment }) => {
    const [isFormVisible, setIsFormVisible] = useState(false); // Для управления видимостью формы
    const [image, setImage] = useState(null); // Для хранения изображения
    const [imageName, setImageName] = useState(''); // Для хранения имени изображения
    const [commentText, setCommentText] = useState('');

    // Функция для переключения видимости формы
    const toggleForm = () => {
        setIsFormVisible(prevState => !prevState); // Переключаем видимость
    };

    // Функция для отображения превью изображения
    const previewImage = (event) => {
        const input = event.target;

        if (input.files && input.files[0]) {
            const file = input.files[0];

            if (!file.type.match('image.*')) {
                alert("Вы вставили не фотографию:(");
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                setImage(e.target.result); // Устанавливаем изображение как base64 строку
                setImageName(file.name); // Устанавливаем имя файла
            };

            reader.readAsDataURL(file);
        }
    };

    // Функция для удаления изображения
    const deletePhoto = () => {
        setImage(null); // Очищаем изображение
        setImageName(''); // Очищаем имя файла

         const input = document.getElementById(`files-post-${postId}`);
         if (input) {
            input.value = null;
        }
    };

    const AddComment = async () => {
        const formData = new FormData();

        const input = document.getElementById(`files-post-${postId}`);
        if (input.files && input.files[0]) {
            formData.append("File", input.files[0]); // Добавляем файл в FormData
        }
        formData.append('Text', commentText); // Добавляем текст
        formData.append('PostId', parseInt(postId)); // Добавляем tradId

        try {
            const token = getToken();

            const response = await fetch(addCommentUrl(), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении поста');
            }

            const newComment = await response.json(); // Предполагаем, что ваш API возвращает добавленный пост
            addComment(newComment);
            // Здесь можно добавить логику для обновления состояния родительского компонента, если нужно

            // Очистка формы после успешной отправки
            setCommentText(''); 
            deletePhoto();
            toggleForm(); // Закрываем форму
            console.log('Коммент успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении Коммент:', error);
        }
    };

    return (
        <div>
            {/* Кнопка для переключения видимости формы */}
            <button
                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button toggle-comments-btn"
                onClick={toggleForm}
            >
                <i className={`fas ${isFormVisible ? 'fa-minus' : 'fa-plus'}`}></i>
                <span className="ml-1" >
                    {isFormVisible ? 'Скрыть комментарий' : 'Добавить комментарий'}
                </span>
            </button>

            {/* Форма для добавления поста */}
            {isFormVisible && (
                <div className="post-form addContent">
                    <h2>Добавить комментарий</h2>

                    {/* Текстовое поле для ввода поста */}
                    <textarea
                        className="trad-textarea"
                        name="text"
                        placeholder="Напишите свой комментарий..."
                        value={commentText} // Привязываем значение текстового поля к состоянию
                        onChange={(e) => setCommentText(e.target.value)} // Обновляем состояние при вводе текста
                    />

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

                    {/* Поле для загрузки изображения */}
                    <input
                        accept="image/gif, image/jpeg, image/png"
                        type="file"
                        id={`files-post-${postId}`}
                        style={{ display: 'none' }}
                        onChange={previewImage}
                    />
                    <label htmlFor={`files-post-${postId}`}>
                        <i className="fa fa-picture-o fa-2x" aria-hidden="true"></i>
                        Добавить изображение
                    </label>

                    {/* Кнопка для отправки поста */}
                    <button onClick={AddComment}
                        className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button">
                        <i className="fas fa-plus"></i> <span className="ml-1">Добавить комментарий</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddComment;
