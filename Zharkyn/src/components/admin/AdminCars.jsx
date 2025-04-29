// src/components/admin/AdminCars.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  
  // Form data for car editing
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

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const carsData = await adminService.getAllCars();
      setCars(carsData);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError('Не удалось загрузить автомобили. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Car handling functions
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

  // Feature handling for car editing
  const handleAddFeature = () => {
    const newFeature = document.getElementById('newFeature').value.trim();
    if (newFeature) {
      setFormData(prev => ({
        ...prev,
        fullCharacteristics: {
          ...prev.fullCharacteristics,
          additionalFeatures: [...prev.fullCharacteristics.additionalFeatures, newFeature]
        }
      }));
      document.getElementById('newFeature').value = '';
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

  // Gallery handling for car editing
  const handleAddGalleryImage = () => {
    const newGalleryImage = document.getElementById('newGalleryImage').value.trim();
    if (newGalleryImage) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage]
      }));
      document.getElementById('newGalleryImage').value = '';
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Car CRUD operations
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
      adminService.deleteCar(id)
        .then(() => {
          setCars(prev => prev.filter(car => car.id !== id));
        })
        .catch(err => {
          console.error('Failed to delete car:', err);
          setError('Не удалось удалить автомобиль');
        });
    }
  };

  const handleSubmitCar = (e) => {
    e.preventDefault();
    
    if (editingCar) {
      // Update existing car
      adminService.updateCar(editingCar.id, formData)
        .then(updatedCar => {
          setCars(prev => prev.map(car => 
            car.id === editingCar.id ? updatedCar : car
          ));
          setEditingCar(null);
        })
        .catch(err => {
          console.error('Failed to update car:', err);
          setError('Не удалось обновить информацию об автомобиле');
        });
    } else {
      // Add new car
      adminService.createCar(formData)
        .then(newCar => {
          setCars(prev => [...prev, newCar]);
          setEditingCar(null);
        })
        .catch(err => {
          console.error('Failed to create car:', err);
          setError('Не удалось создать новый автомобиль');
        });
    }
  };

  if (loading && !editingCar) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
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
      
      {error && <div className="admin-error">{error}</div>}
      
      {editingCar !== null && (
        <div className="car-form-container">
          <h3>{editingCar.id ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h3>
          <form onSubmit={handleSubmitCar} className="car-form">
            {/* Car form fields */}
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
                  id="newFeature"
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
                  id="newGalleryImage"
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
  );
};

export default AdminCars;