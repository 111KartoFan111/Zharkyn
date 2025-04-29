// src/pages/AddListing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { carService } from '../services/api';
import '../styles/pages/AddListing.css';

const AddListing = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    category: 'Used Car',
    body_type: '',
    engine_type: 'Бензиновый',
    drive_unit: 'Передний привод',
    color: '',
    mileage: '',
    transmission: 'Механика',
    short_description: '',
    image: '',
    gallery: [''],
    additional_features: ['']
  });
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFeatureChange = (index, value) => {
    const features = [...formData.additional_features];
    features[index] = value;
    setFormData(prev => ({
      ...prev,
      additional_features: features
    }));
  };
  
  const addFeatureInput = () => {
    setFormData(prev => ({
      ...prev,
      additional_features: [...prev.additional_features, '']
    }));
  };
  
  const removeFeatureInput = (index) => {
    const features = [...formData.additional_features];
    features.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      additional_features: features
    }));
  };
  
  const handleGalleryChange = (index, value) => {
    const gallery = [...formData.gallery];
    gallery[index] = value;
    setFormData(prev => ({
      ...prev,
      gallery
    }));
  };
  
  const addGalleryInput = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };
  
  const removeGalleryInput = (index) => {
    const gallery = [...formData.gallery];
    gallery.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      gallery
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Filter out empty values from arrays
      const cleanedFormData = {
        ...formData,
        additional_features: formData.additional_features.filter(feature => feature.trim() !== ''),
        gallery: formData.gallery.filter(url => url.trim() !== '')
      };
      
      // Set main image if not provided
      if (!cleanedFormData.image && cleanedFormData.gallery.length > 0) {
        cleanedFormData.image = cleanedFormData.gallery[0];
      }
      
      // Add status and creator
      const listingData = {
        ...cleanedFormData,
        status: 'pending',
        creator_id: user.id
      };
      
      await carService.createListing(listingData);
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      console.error('Failed to create listing:', err);
      setError('Не удалось создать объявление. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="add-listing-container">
        <h1>Создать объявление</h1>
        
        {success ? (
          <div className="success-message">
            <h2>Объявление успешно отправлено на модерацию!</h2>
            <p>После проверки администратором, ваше объявление будет опубликовано на сайте.</p>
            <p>Вы будете перенаправлены на страницу профиля через несколько секунд...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="listing-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-section">
              <h2>Основная информация</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="brand">Марка*</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="model">Модель*</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="year">Год выпуска*</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Цена*</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="например: 5 000 000 ₸"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Категория*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="New Car">Новый автомобиль</option>
                    <option value="Used Car">Подержанный автомобиль</option>
                    <option value="In Stock">В наличии</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Характеристики</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="body_type">Тип кузова*</label>
                  <select
                    id="body_type"
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите тип кузова</option>
                    <option value="Седан">Седан</option>
                    <option value="Хэтчбек">Хэтчбек</option>
                    <option value="Внедорожник">Внедорожник</option>
                    <option value="Кроссовер">Кроссовер</option>
                    <option value="Универсал">Универсал</option>
                    <option value="Купе">Купе</option>
                    <option value="Кабриолет">Кабриолет</option>
                    <option value="Минивэн">Минивэн</option>
                    <option value="Пикап">Пикап</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="engine_type">Тип двигателя*</label>
                  <select
                    id="engine_type"
                    name="engine_type"
                    value={formData.engine_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Бензиновый">Бензиновый</option>
                    <option value="Дизельный">Дизельный</option>
                    <option value="Гибридный">Гибридный</option>
                    <option value="Электрический">Электрический</option>
                    <option value="Газ">Газ</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="drive_unit">Привод*</label>
                  <select
                    id="drive_unit"
                    name="drive_unit"
                    value={formData.drive_unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Передний привод">Передний привод</option>
                    <option value="Задний привод">Задний привод</option>
                    <option value="Полный привод">Полный привод</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="transmission">Коробка передач*</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Механика">Механика</option>
                    <option value="Автомат">Автомат</option>
                    <option value="Робот">Робот</option>
                    <option value="Вариатор">Вариатор</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Цвет*</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="mileage">Пробег (км)</label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    min="0"
                    value={formData.mileage}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Описание</h2>
              <div className="form-group">
                <label htmlFor="short_description">Краткое описание*</label>
                <textarea
                  id="short_description"
                  name="short_description"
                  rows="4"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <h3>Дополнительные особенности</h3>
              {formData.additional_features.map((feature, index) => (
                <div key={index} className="feature-input">
                  <input
                    type="text"
                    placeholder="Например: Климат-контроль"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  {index > 0 && (
                    <button 
                      type="button" 
                      className="remove-button"
                      onClick={() => removeFeatureInput(index)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="add-button"
                onClick={addFeatureInput}
              >
                + Добавить особенность
              </button>
            </div>
            
            <div className="form-section">
              <h2>Галерея изображений</h2>
              <p className="form-hint">Добавьте URL-адреса изображений вашего автомобиля</p>
              
              <div className="form-group">
                <label htmlFor="image">Основное изображение*</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  placeholder="URL основного изображения"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <h3>Дополнительные изображения</h3>
              {formData.gallery.map((url, index) => (
                <div key={index} className="gallery-input">
                  <input
                    type="text"
                    placeholder="URL изображения"
                    value={url}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                  />
                  {index > 0 && (
                    <button 
                      type="button" 
                      className="remove-button"
                      onClick={() => removeGalleryInput(index)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="add-button"
                onClick={addGalleryInput}
              >
                + Добавить изображение
              </button>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Отправка...' : 'Отправить на модерацию'}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AddListing;