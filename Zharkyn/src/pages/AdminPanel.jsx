import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/AdminPanel.css';
import carData from '../carData.json';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    category: '',
    price: '',
    shortDescription: '',
    image: '',
    fullCharacteristics: {
      year: '',
      bodyType: '',
      engineType: '',
      driveUnit: '',
      color: '',
      mileage: '',
      additionalFeatures: []
    },
    gallery: []
  });
  const [newFeature, setNewFeature] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    // Fetch cars and users (mock for now)
    setLoading(true);
    
    setTimeout(() => {
      // Use the imported car data
      setCars(carData.cars);
      
      // Mock users data
      setUsers([
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', registeredDate: '10.01.2025' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', registeredDate: '15.01.2025' },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', registeredDate: '20.02.2025' }
      ]);
      
      setLoading(false);
    }, 1000);
    
    // Real implementation will fetch from API
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties in fullCharacteristics
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        fullCharacteristics: {
          ...prev.fullCharacteristics,
          additionalFeatures: [...prev.fullCharacteristics.additionalFeatures, newFeature.trim()]
        }
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      fullCharacteristics: {
        ...prev.fullCharacteristics,
        additionalFeatures: prev.fullCharacteristics.additionalFeatures.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      category: car.category,
      price: car.price,
      shortDescription: car.shortDescription,
      image: car.image,
      fullCharacteristics: { ...car.fullCharacteristics },
      gallery: [...car.gallery]
    });
  };

  const handleDeleteCar = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      // Mock delete
      setCars(prev => prev.filter(car => car.id !== id));
      
      // Real implementation will call API
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCar) {
      // Update existing car
      setCars(prev => prev.map(car => 
        car.id === editingCar.id ? { ...car, ...formData } : car
      ));
    } else {
      // Add new car
      const newCar = {
        id: Math.max(0, ...cars.map(car => car.id)) + 1,
        ...formData,
        time: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
      };
      
      setCars(prev => [...prev, newCar]);
    }
    
    // Reset form
    setEditingCar(null);
    setFormData({
      brand: '',
      model: '',
      category: '',
      price: '',
      shortDescription: '',
      image: '',
      fullCharacteristics: {
        year: '',
        bodyType: '',
        engineType: '',
        driveUnit: '',
        color: '',
        mileage: '',
        additionalFeatures: []
      },
      gallery: []
    });
    
    // Real implementation will call API
  };

  if (loading) {
    return (
      <>
        <Header user={user} />
        <div className="admin-container">
          <div className="loading">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header user={user} />
      <div className="admin-container">
        <h1>Панель администратора</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            Автомобили
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
        </div>
        
        {activeTab === 'cars' && (
          <div className="cars-section">
            <div className="section-header">
              <h2>Управление автомобилями</h2>
              {!editingCar && (
                <button 
                  className="add-button"
                  onClick={() => setEditingCar({})}
                >
                  Добавить автомобиль
                </button>
              )}
            </div>
            
            {editingCar !== null && (
              <div className="car-form-container">
                <h3>{editingCar.id ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h3>
                <form onSubmit={handleSubmit} className="car-form">
                  <div className="form-columns">
                    <div className="form-column">
                      <div className="form-group">
                        <label htmlFor="brand">Марка*</label>
                        <input
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
                          id="model"
                          name="model"
                          value={formData.model}
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
                          <option value="">Выберите категорию</option>
                          <option value="New Car">Новый автомобиль</option>
                          <option value="Used Car">Подержанный автомобиль</option>
                          <option value="In Stock">В наличии</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="price">Цена*</label>
                        <input
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="shortDescription">Краткое описание*</label>
                        <textarea
                          id="shortDescription"
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleInputChange}
                          required
                          rows="3"
                        ></textarea>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="image">Основное изображение (URL)*</label>
                        <input
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-column">
                      <h4>Характеристики</h4>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.year">Год выпуска*</label>
                        <input
                          id="fullCharacteristics.year"
                          name="fullCharacteristics.year"
                          value={formData.fullCharacteristics.year}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.bodyType">Тип кузова*</label>
                        <input
                          id="fullCharacteristics.bodyType"
                          name="fullCharacteristics.bodyType"
                          value={formData.fullCharacteristics.bodyType}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.engineType">Тип двигателя*</label>
                        <input
                          id="fullCharacteristics.engineType"
                          name="fullCharacteristics.engineType"
                          value={formData.fullCharacteristics.engineType}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.driveUnit">Привод*</label>
                        <input
                          id="fullCharacteristics.driveUnit"
                          name="fullCharacteristics.driveUnit"
                          value={formData.fullCharacteristics.driveUnit}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.color">Цвет*</label>
                        <input
                          id="fullCharacteristics.color"
                          name="fullCharacteristics.color"
                          value={formData.fullCharacteristics.color}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fullCharacteristics.mileage">Пробег</label>
                        <input
                          id="fullCharacteristics.mileage"
                          name="fullCharacteristics.mileage"
                          value={formData.fullCharacteristics.mileage || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="features-section">
                    <h4>Дополнительные функции</h4>
                    <div className="add-feature">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Добавить функцию"
                      />
                      <button type="button" onClick={handleAddFeature}>Добавить</button>
                    </div>
                    
                    <ul className="features-list">
                      {formData.fullCharacteristics.additionalFeatures.map((feature, index) => (
                        <li key={index}>
                          {feature}
                          <button 
                            type="button" 
                            className="remove-button"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            Удалить
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="gallery-section">
                    <h4>Галерея изображений</h4>
                    <div className="add-gallery-image">
                      <input
                        type="text"
                        value={newGalleryImage}
                        onChange={(e) => setNewGalleryImage(e.target.value)}
                        placeholder="URL изображения"
                      />
                      <button type="button" onClick={handleAddGalleryImage}>Добавить</button>
                    </div>
                    
                    <div className="gallery-preview">
                      {formData.gallery.map((img, index) => (
                        <div key={index} className="gallery-item">
                          <img src={img} alt={`Gallery ${index}`} />
                          <button 
                            type="button" 
                            className="remove-button"
                            onClick={() => handleRemoveGalleryImage(index)}
                          >
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      {editingCar.id ? 'Сохранить' : 'Добавить'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setEditingCar(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="cars-table-container">
              <table className="cars-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Изображение</th>
                    <th>Марка</th>
                    <th>Модель</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td className="car-image-cell">
                        <img src={car.image} alt={`${car.brand} ${car.model}`} />
                      </td>
                      <td>{car.brand}</td>
                      <td>{car.model}</td>
                      <td>{car.category}</td>
                      <td>{car.price}</td>
                      <td className="actions-cell">
                        <button 
                          className="edit-button"
                          onClick={() => handleEditCar(car)}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteCar(car.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Управление пользователями</h2>
            
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.registeredDate}</td>
                      <td className="actions-cell">
                        <button className="edit-button">Редактировать</button>
                        <button className="delete-button">Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;