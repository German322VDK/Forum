import React, { useState } from 'react';
import {getToken} from '../../../utils';
import {addTradUrl} from '../../../urls';

const AddTrad = ({ addTrad }) =>{
    const [isFormVisible, setIsFormVisible] = useState(false); // Для управления видимостью формы
    const [image, setImage] = useState(null); // Для хранения изображения
    const [imageName, setImageName] = useState(''); // Для хранения имени изображения
    const [tradText, setTradText] = useState('');

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

         const input = document.getElementById(`files-trad`);
         if (input) {
            input.value = null;
        }
    };

    const AddTrad = async()=>{
        const formData = new FormData();

        const input = document.getElementById(`files-trad`);
        if (input.files && input.files[0]) {
            formData.append("File", input.files[0]); // Добавляем файл в FormData
        }
        formData.append('Text', tradText); // Добавляем текст

        try {
            const token = getToken();

            const response = await fetch(addTradUrl(), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении трэда');
            }

            const newTrad = await response.json(); // Предполагаем, что ваш API возвращает добавленный трэд

            // Добавляем новый трэд в состояние HomePage
            addTrad(newTrad);

            // Очистка формы после успешной отправки
            setTradText('');
            deletePhoto();
            toggleForm(); // Закрываем форму
            console.log('Трэд успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении трэда:', error);
        }
    };

    return(
        <div>
            {/* Кнопка для переключения видимости формы */}
            <button
                className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button toggle-comments-btn"
                onClick={toggleForm}
            >
                <i className={`fas ${isFormVisible ? 'fa-minus' : 'fa-plus'}`}></i>
                <span className="ml-1" >
                    {isFormVisible ? 'Скрыть трэд' : 'Добавить трэд'}
                </span>
            </button>

            {/* Форма для добавления поста */}
            {isFormVisible && (
                <div className="post-form addContent">
                    <h2>Добавить трэд</h2>

                    {/* Текстовое поле для ввода поста */}
                    <textarea
                        className="trad-textarea"
                        name="text"
                        placeholder="Напишите свой трэд..."
                        value={tradText} // Привязываем значение текстового поля к состоянию
                        onChange={(e) => setTradText(e.target.value)} // Обновляем состояние при вводе текста
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
                        id={`files-trad`}
                        style={{ display: 'none' }}
                        onChange={previewImage}
                    />
                    <label htmlFor={`files-trad`}>
                        <i className="fa fa-picture-o fa-2x" aria-hidden="true"></i>
                        Добавить изображение
                    </label>

                    {/* Кнопка для отправки поста */}
                    <button onClick={AddTrad}
                     className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button">
                        <i className="fas fa-plus"></i> <span className="ml-1">Добавить трэд</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddTrad;